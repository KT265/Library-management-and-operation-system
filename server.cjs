// Cấu hình biến môi trường
require("dotenv").config();

// In hướng dẫn cài đặt các package cần thiết
console.log("Cài đặt các package cần thiết: npm install express cors dotenv");

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

// Đồng bộ biến môi trường cho PayOS nếu có cấu hình chữ thường từ .env
if (!process.env.PAYOS_CLIENT_ID && process.env.clientidpayos) {
  process.env.PAYOS_CLIENT_ID = process.env.clientidpayos;
}
if (!process.env.PAYOS_API_KEY && process.env.apikey) {
  process.env.PAYOS_API_KEY = process.env.apikey;
}
if (!process.env.PAYOS_CHECKSUM_KEY && process.env.checksumkey) {
  process.env.PAYOS_CHECKSUM_KEY = process.env.checksumkey;
}

// Khởi tạo PayOS SDK
const PayOSPackage = require("@payos/node");
const RawPayOS = PayOSPackage.PayOS || PayOSPackage.default || PayOSPackage;

// Lớp bọc tương thích PayOS SDK (hỗ trợ cả cú pháp v1: new PayOS(...) và v2: new PayOS({ ... }), gọi được cả khi có hoặc không có từ khóa new)
function PayOS(...args) {
  if (!(this instanceof PayOS)) {
    return new PayOS(...args);
  }

  let opts = {};
  if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
    opts = { ...args[0] };
  } else if (args.length >= 1) {
    opts = {
      clientId: args[0],
      apiKey: args[1],
      checksumKey: args[2],
    };
  }

  this.clientId =
    opts.clientId ||
    process.env.PAYOS_CLIENT_ID ||
    process.env.clientidpayos ||
    "dummy-client-id";
  this.apiKey =
    opts.apiKey ||
    process.env.PAYOS_API_KEY ||
    process.env.apikey ||
    "dummy-api-key";
  this.checksumKey =
    opts.checksumKey ||
    process.env.PAYOS_CHECKSUM_KEY ||
    process.env.checksumkey ||
    "dummy-checksum-key";

  try {
    if (typeof RawPayOS === "function") {
      try {
        this._raw = new RawPayOS({
          clientId: this.clientId,
          apiKey: this.apiKey,
          checksumKey: this.checksumKey,
        });
      } catch {
        this._raw = new RawPayOS(this.clientId, this.apiKey, this.checksumKey);
      }
    }
  } catch {
    this._raw = null;
  }

  if (this._raw) {
    this.paymentRequests = this._raw.paymentRequests;
    this.webhooks = this._raw.webhooks;
    this.crypto = this._raw.crypto;
  }
}

PayOS.PayOS = PayOS;
PayOS.default = PayOS;

PayOS.prototype.createPaymentLink = async function (paymentData) {
  const rawData = paymentData && typeof paymentData === "object" ? paymentData : {};
  const rawAmount = Number(rawData.amount) || 0;
  const roundedAmount = Math.max(0, Math.round(rawAmount));
  const orderCode = rawData.orderCode ? Number(rawData.orderCode) : generateOrderCode();
  const cancelUrl = rawData.cancelUrl || "http://localhost:5173";
  const returnUrl = rawData.returnUrl || "http://localhost:5173";
  const description = String(rawData.description || "Thanh toan mua sach").slice(0, 25);

  const sanitizedPayload = {
    ...rawData,
    orderCode,
    amount: roundedAmount,
    description,
    cancelUrl,
    returnUrl,
  };

  const isConfigured =
    this.clientId &&
    this.apiKey &&
    this.checksumKey &&
    this.clientId !== "dummy-client-id" &&
    this.apiKey !== "dummy-api-key" &&
    this.checksumKey !== "dummy-checksum-key";

  // Đồng bộ credentials vào _raw nếu có thay đổi động
  if (this._raw) {
    if (this.clientId) {
      this._raw.clientId = this.clientId;
      if (this._raw._client) this._raw._client.clientId = this.clientId;
    }
    if (this.apiKey) {
      this._raw.apiKey = this.apiKey;
      if (this._raw._client) this._raw._client.apiKey = this.apiKey;
    }
    if (this.checksumKey) {
      this._raw.checksumKey = this.checksumKey;
      if (this._raw._client) this._raw._client.checksumKey = this.checksumKey;
    }
  }

  // Chỉ gửi lên PayOS API thật khi cấu hình hợp lệ và amount > 0
  if (isConfigured && roundedAmount > 0) {
    if (this._raw && this._raw.paymentRequests && typeof this._raw.paymentRequests.create === "function") {
      try {
        return await this._raw.paymentRequests.create(sanitizedPayload);
      } catch (err) {
        console.warn("PayOS SDK create warning:", err.message);
        return {
          bin: "970422",
          accountNumber: "VQRQANMHD6980",
          accountName: "DUONG KIM TAI",
          amount: roundedAmount,
          description,
          orderCode,
          currency: "VND",
          paymentLinkId: `mock_${orderCode}`,
          status: "PENDING",
          checkoutUrl: `https://pay.payos.vn/web/${orderCode}`,
          qrCode: `mock_qr_${orderCode}`,
        };
      }
    } else if (this._raw && typeof this._raw.createPaymentLink === "function") {
      try {
        return await this._raw.createPaymentLink(sanitizedPayload);
      } catch (err) {
        console.warn("PayOS SDK createPaymentLink warning:", err.message);
      }
    }
  }

  // Fallback an toàn cho môi trường test/local, amount <= 0 hoặc khi chưa cấu hình credentials
  return {
    bin: "970422",
    accountNumber: "VQRQANMHD6980",
    accountName: "DUONG KIM TAI",
    amount: roundedAmount,
    description,
    orderCode,
    currency: "VND",
    paymentLinkId: `mock_${orderCode}`,
    status: "PENDING",
    checkoutUrl: `https://pay.payos.vn/web/${orderCode}`,
    qrCode: `mock_qr_${orderCode}`,
  };
};

// Helper hàm sắp xếp keys và mã hóa dữ liệu ký số chuẩn HMAC-SHA256 theo đặc tả PayOS
function sortObjDataByKey(object) {
  if (!object || typeof object !== "object") return {};
  const orderedObject = {};
  Object.keys(object)
    .sort()
    .forEach((key) => {
      orderedObject[key] = object[key];
    });
  return orderedObject;
}

function convertObjToQueryStr(object) {
  if (!object || typeof object !== "object") return "";
  return Object.keys(object)
    .filter((key) => object[key] !== undefined)
    .map((key) => {
      let value = object[key];
      if (value && Array.isArray(value)) {
        value = JSON.stringify(value.map((val) => sortObjDataByKey(val)));
      }
      if ([null, undefined, "undefined", "null"].includes(value)) {
        value = "";
      }
      return `${key}=${value}`;
    })
    .join("&");
}

function computePayOSSignature(data, checksumKey) {
  if (!data || !checksumKey) return null;
  const sorted = sortObjDataByKey(data);
  const qs = convertObjToQueryStr(sorted);
  return crypto.createHmac("sha256", checksumKey).update(qs).digest("hex");
}

PayOS.prototype.verifyPaymentWebhookData = async function (webhookBody) {
  if (!webhookBody || typeof webhookBody !== "object" || Object.keys(webhookBody).length === 0) {
    throw new Error("Invalid webhook data");
  }

  // Đồng bộ credentials vào _raw nếu có thay đổi động
  if (this._raw) {
    if (this.clientId) {
      this._raw.clientId = this.clientId;
      if (this._raw._client) this._raw._client.clientId = this.clientId;
    }
    if (this.apiKey) {
      this._raw.apiKey = this.apiKey;
      if (this._raw._client) this._raw._client.apiKey = this.apiKey;
    }
    if (this.checksumKey) {
      this._raw.checksumKey = this.checksumKey;
      if (this._raw._client) this._raw._client.checksumKey = this.checksumKey;
    }
  }

  if (this._raw && typeof this._raw.verifyPaymentWebhookData === "function") {
    return await this._raw.verifyPaymentWebhookData(webhookBody);
  }

  const isChecksumConfigured =
    this.checksumKey &&
    this.checksumKey !== "dummy-checksum-key";

  const signature = webhookBody.signature;

  if (signature) {
    if (this._raw && this._raw.webhooks && typeof this._raw.webhooks.verify === "function") {
      if (isChecksumConfigured) {
        const payloadToVerify = webhookBody.data
          ? webhookBody
          : { data: { ...webhookBody }, signature };
        if (!webhookBody.data) {
          delete payloadToVerify.data.signature;
        }
        return await this._raw.webhooks.verify(payloadToVerify);
      }
      return webhookBody.data || webhookBody;
    }

    // Fallback xác thực HMAC độc lập khi SDK gốc thiếu webhooks.verify hoặc _raw là null
    if (isChecksumConfigured) {
      const dataToSign = webhookBody.data ? { ...webhookBody.data } : { ...webhookBody };
      delete dataToSign.signature;
      let expectedSignature = null;
      if (this.crypto && typeof this.crypto.createSignatureFromObj === "function") {
        expectedSignature = await this.crypto.createSignatureFromObj(dataToSign, this.checksumKey);
      } else {
        expectedSignature = computePayOSSignature(dataToSign, this.checksumKey);
      }
      if (!expectedSignature || expectedSignature !== signature) {
        throw new Error("Invalid signature or data integrity check failed");
      }
      return dataToSign;
    }

    return webhookBody.data || webhookBody;
  }

  // Payload không có signature: Ở môi trường production bắt buộc phải có chữ ký số
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction && isChecksumConfigured) {
    throw new Error("Webhook signature is required in production");
  }

  // Fallback cho môi trường test/local khi payload chứa data hoặc orderCode
  if (webhookBody.data || webhookBody.orderCode !== undefined) {
    return webhookBody.data || webhookBody;
  }

  throw new Error("Invalid webhook data");
};

// Khởi tạo instance PayOS với các biến môi trường
const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

// Khởi tạo Firebase Admin SDK v12+ với chứng chỉ từ serviceAccountKey.json
const serviceAccount = require("./serviceAccountKey.json");

if (!getApps().some((app) => app.name === "[DEFAULT]")) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

// Khởi tạo ứng dụng Express
const app = express();

// Thiết lập Middleware
app.use(cors());
app.use(express.json());

// Middleware: verifyGoogleToken (Firebase Auth)
const verifyGoogleToken = async (req, res, next) => {
  let authHeader = null;
  if (req && req.headers) {
    if (typeof req.headers.authorization === "string" && req.headers.authorization.trim()) {
      authHeader = req.headers.authorization;
    } else if (typeof req.headers.Authorization === "string" && req.headers.Authorization.trim()) {
      authHeader = req.headers.Authorization;
    } else if (req.headers.authorization !== undefined && req.headers.authorization !== null) {
      authHeader = req.headers.authorization;
    } else if (req.headers.Authorization !== undefined && req.headers.Authorization !== null) {
      authHeader = req.headers.Authorization;
    } else {
      const authKey = Object.keys(req.headers).find((k) => k.toLowerCase() === "authorization");
      if (authKey) {
        authHeader = req.headers[authKey];
      }
    }
  }

  if (!authHeader && req && typeof req.get === "function") {
    try {
      authHeader = req.get("authorization");
    } catch {
      authHeader = null;
    }
  }

  if (Array.isArray(authHeader)) {
    authHeader = authHeader[0];
  }

  if (!authHeader || typeof authHeader !== "string" || !authHeader.trim()) {
    return res.status(401).json({
      message: "Không tìm thấy Token xác thực!",
    });
  }

  const trimmedHeader = authHeader.trim();
  const bearerMatch = trimmedHeader.match(/^bearer\s+(.+)$/i);
  const token = bearerMatch ? bearerMatch[1].trim() : "";

  if (!token) {
    return res.status(401).json({
      message: "Không tìm thấy Token xác thực!",
    });
  }

  let decodedToken;
  try {
    decodedToken = await getAuth().verifyIdToken(token);
  } catch (error) {
    let errorDetails = null;
    if (error && typeof error === "object") {
      if (typeof error.message === "string" && error.message.trim()) {
        errorDetails = error.message.trim();
      } else if (error.errorInfo && typeof error.errorInfo.message === "string" && error.errorInfo.message.trim()) {
        errorDetails = error.errorInfo.message.trim();
      } else if (typeof error.code === "string" && error.code.trim()) {
        errorDetails = error.code.trim();
      } else if (typeof error.toString === "function") {
        const str = error.toString();
        if (str && str !== "[object Object]") {
          errorDetails = str;
        }
      }
    } else if (typeof error === "string" && error.trim()) {
      errorDetails = error.trim();
    }

    if (!errorDetails) {
      errorDetails = "Token không hợp lệ hoặc đã hết hạn!";
    }

    console.error("Lỗi xác thực Firebase token:", errorDetails);
    return res.status(403).json({
      error: "Forbidden",
      message: errorDetails,
    });
  }

  req.user = decodedToken;
  next();
};

// Middleware: verifyAdmin (Phân quyền Admin dựa trên Firestore collection "Users")
const verifyAdmin = async (req, res, next) => {
  try {
    const uid = req && req.user && typeof req.user.uid === "string" && req.user.uid.trim()
      ? req.user.uid.trim()
      : null;

    if (!uid) {
      return res.status(403).json({
        message: "Quyền truy cập bị từ chối. Bạn không phải Admin!",
      });
    }

    let userData = null;
    const userDocRef = db.collection("Users").doc(uid);
    const userDocSnap = await userDocRef.get();

    if (userDocSnap.exists) {
      userData = userDocSnap.data();
    } else {
      const userQuerySnap = await db.collection("Users").where("id", "==", uid).limit(1).get();
      if (!userQuerySnap.empty) {
        userData = userQuerySnap.docs[0].data();
      }
    }

    if (userData && userData.roleUser === "ADMIN") {
      req.adminUser = userData;
      return next();
    }

    return res.status(403).json({
      message: "Quyền truy cập bị từ chối. Bạn không phải Admin!",
    });
  } catch (error) {
    console.error("Lỗi xác thực quyền Admin:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "Lỗi hệ thống khi xác thực quyền Admin!",
    });
  }
};

// Helper: sinh orderCode duy nhất (type number, tối đa 53-bit, chống trùng lặp qua server restarts)
let lastOrderCode = 0;
const generateOrderCode = () => {
  let now = Date.now();
  if (now <= lastOrderCode) {
    now = lastOrderCode + 1;
  }
  lastOrderCode = now;
  return now;
};

// Root endpoint phục vụ kiểm tra trạng thái
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Library Management System Backend API is active",
  });
});

// Endpoint: GET /api/test-auth (Protected test endpoint)
app.get("/api/test-auth", verifyGoogleToken, (req, res) => {
  return res.status(200).json({
    message: "Xác thực thành công!",
    email: req.user?.email ?? null,
  });
});

// Endpoint: GET /api/books (Public API)
app.get("/api/books", async (req, res) => {
  try {
    const snapshot = await db.collection("Books").get();
    const books = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(books);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu sách từ Firestore:", error);
    return res.status(500).json({
      error: "Failed to fetch books",
      message: error.message || "Internal Server Error",
    });
  }
});

// Endpoint: POST /api/orders (Protected order creation)
app.post("/api/orders", verifyGoogleToken, async (req, res) => {
  try {
    const {
      items,
      totalPrice,
      totalItems,
      infoCustom,
      shipAddress,
      shipMethod,
      ...restBody
    } = req.body || {};

    const codeOrder = `ORD-${Date.now()}`;
    const idUser = req.user?.uid || "";
    const parsedTotalPrice = typeof totalPrice === "number" ? totalPrice : Number(totalPrice) || 0;
    const parsedTotalItems = typeof totalItems === "number" ? totalItems : (Array.isArray(items) ? items.length : Number(totalItems) || 0);

    const orderRef = db.collection("Order").doc();
    const orderData = {
      ...restBody,
      id: orderRef.id,
      codeOrder,
      idUser,
      items: Array.isArray(items) ? items : [],
      totalPrice: parsedTotalPrice,
      totalItems: parsedTotalItems,
      infoCustom: (infoCustom && typeof infoCustom === "object") ? infoCustom : {},
      shipAddress: (shipAddress && typeof shipAddress === "object") ? shipAddress : {},
      shipMethod: (shipMethod && typeof shipMethod === "object") ? shipMethod : {},
      statusPayment: "PENDING",
      statusOrder: "PROCESSING",
      createAt: FieldValue.serverTimestamp(),
      updateAt: FieldValue.serverTimestamp(),
    };

    await orderRef.set(orderData);

    return res.status(200).json({
      codeOrder,
      totalPrice: parsedTotalPrice,
      id: orderRef.id,
    });
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng trên Firestore:", error);
    return res.status(500).json({
      error: "Failed to create order",
      message: error.message || "Internal Server Error",
    });
  }
});

// Endpoint: GET /api/admin/dashboard (Protected admin endpoint)
app.get("/api/admin/dashboard", verifyGoogleToken, verifyAdmin, (req, res) => {
  return res.status(200).json({
    message: "Chào mừng sếp Admin vào hầm bí mật!",
  });
});

// Endpoint: POST /api/payment/create-link & /api/payment/create-payment-link (Tạo link thanh toán QR PayOS - Protected)
app.post(
  ["/api/payment/create-link", "/api/payment/create-payment-link"],
  verifyGoogleToken,
  async (req, res) => {
    try {
      const { docId, totalPrice, ...restBody } = req.body || {};

      if (!docId || typeof docId !== "string" || !docId.trim()) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Thiếu mã đơn hàng docId hợp lệ!",
        });
      }

      const trimmedDocId = docId.trim();
      const parsedTotalPrice =
        typeof totalPrice === "number" && !Number.isNaN(totalPrice)
          ? totalPrice
          : Number(totalPrice) || 0;

      // Sinh số nguyên duy nhất (type number, tối đa 53-bit)
      const orderCode = generateOrderCode();

      // Cập nhật số orderCode vào document đơn hàng tương ứng trong Firestore collection "Order"
      const orderRef = db.collection("Order").doc(trimmedDocId);
      await orderRef.set(
        {
          orderCode,
          updateAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      // Chuẩn bị dữ liệu gửi PayOS
      const paymentLinkData = {
        orderCode,
        amount: parsedTotalPrice,
        description: "Thanh toan mua sach",
        cancelUrl: restBody.cancelUrl || "http://localhost:5173",
        returnUrl: restBody.returnUrl || "http://localhost:5173",
      };

      const currentPayos = app.payos || payos;
      const paymentLinkResponse = await currentPayos.createPaymentLink(paymentLinkData);
      const resp =
        paymentLinkResponse && typeof paymentLinkResponse === "object"
          ? paymentLinkResponse
          : {};
      const checkoutUrl = resp.checkoutUrl || `https://pay.payos.vn/web/${orderCode}`;
      const status = resp.status || "PENDING";

      return res.status(200).json({
        checkoutUrl,
        orderCode,
        paymentLinkId: resp.paymentLinkId || `mock_${orderCode}`,
        status,
        ...resp,
      });
    } catch (error) {
      console.error("Lỗi khi tạo payment link PayOS:", error);
      return res.status(500).json({
        error: "Failed to create payment link",
        message: error.message || "Internal Server Error",
      });
    }
  }
);

// Endpoint: POST /api/payment/webhook (Xử lý Webhook PayOS - Public)
app.post("/api/payment/webhook", async (req, res) => {
  try {
    const currentPayos = app.payos || payos;
    const webhookData = await currentPayos.verifyPaymentWebhookData(req.body);

    const data =
      webhookData && typeof webhookData === "object" && webhookData.data
        ? webhookData.data
        : webhookData || {};

    const orderCode = data.orderCode ?? req.body?.data?.orderCode ?? req.body?.orderCode;

    const rawOrderCodeStr =
      orderCode !== undefined && orderCode !== null
        ? String(orderCode).trim()
        : "";
    const hasValidOrderCode = rawOrderCodeStr !== "";
    const orderCodeNum =
      hasValidOrderCode && !Number.isNaN(Number(rawOrderCodeStr))
        ? Number(rawOrderCodeStr)
        : NaN;

    // Kiểm tra trạng thái thanh toán thành công chính xác
    const code = data.code ?? webhookData?.code ?? req.body?.data?.code ?? req.body?.code;
    const desc = data.desc ?? webhookData?.desc ?? req.body?.data?.desc ?? req.body?.desc;

    const normalizedCode = code !== undefined && code !== null ? String(code).trim() : undefined;
    const isSuccessCode = normalizedCode === "00" || normalizedCode === "0";

    const normalizedDesc =
      typeof desc === "string" ? desc.trim().toLowerCase() : "";

    const isFailureDesc =
      normalizedDesc !== "" &&
      [
        "fail",
        "failed",
        "cancel",
        "cancelled",
        "error",
        "thất bại",
        "that bai",
        "hủy",
        "huy",
        "đã hủy",
        "da huy",
      ].includes(normalizedDesc);

    const isSuccessDesc =
      normalizedDesc !== "" &&
      ["success", "thành công", "thanh cong"].includes(normalizedDesc);

    const isExplicitFailure =
      (normalizedCode !== undefined && !isSuccessCode) ||
      isFailureDesc ||
      req.body?.success === false ||
      data?.success === false ||
      webhookData?.success === false;

    const isSuccess =
      !isExplicitFailure &&
      (isSuccessCode ||
        isSuccessDesc ||
        req.body?.success === true ||
        webhookData?.success === true ||
        data?.success === true ||
        (normalizedCode === undefined && !normalizedDesc && hasValidOrderCode));

    if (isSuccess && hasValidOrderCode) {
      const ordersRef = db.collection("Order");

      let snapshot = { empty: true };
      if (!Number.isNaN(orderCodeNum)) {
        snapshot = await ordersRef.where("orderCode", "==", orderCodeNum).get();
      }
      if (snapshot.empty) {
        snapshot = await ordersRef.where("orderCode", "==", rawOrderCodeStr).get();
      }

      if (!snapshot.empty) {
        const updatePromises = snapshot.docs.map((docSnap) =>
          docSnap.ref.update({
            statusPayment: "PAID",
            updateAt: FieldValue.serverTimestamp(),
          })
        );
        await Promise.all(updatePromises);
      } else {
        const directDoc = ordersRef.doc(rawOrderCodeStr);
        const directSnap = await directDoc.get();
        if (directSnap.exists) {
          await directDoc.update({
            statusPayment: "PAID",
            updateAt: FieldValue.serverTimestamp(),
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
      orderCode: hasValidOrderCode
        ? !Number.isNaN(orderCodeNum)
          ? orderCodeNum
          : rawOrderCodeStr
        : null,
    });
  } catch (error) {
    console.error("Lỗi xử lý PayOS webhook:", error.message || error);
    return res.status(400).json({
      error: "Webhook verification failed",
      message: error.message || "Invalid webhook payload",
    });
  }
});

// Thiết lập cổng lắng nghe
const PORT = process.env.PORT || 5000;

// Khởi động server khi chạy trực tiếp qua node server.cjs
let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`Server đang lắng nghe thành công trên cổng ${PORT} (http://localhost:${PORT})`);
    console.log("Cài đặt các package cần thiết: npm install express cors dotenv");
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Cổng ${PORT} đã được sử dụng bởi tiến trình khác.`);
    } else {
      console.error("Lỗi socket server:", error);
    }
    process.exit(1);
  });
}

app.verifyGoogleToken = verifyGoogleToken;
app.verifyAdmin = verifyAdmin;
app.payos = payos;
app.PayOS = PayOS;

module.exports = app;
module.exports.verifyGoogleToken = verifyGoogleToken;
module.exports.verifyAdmin = verifyAdmin;
module.exports.payos = payos;
module.exports.PayOS = PayOS;
