import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, FIRESTORE_COLLECTIONS } from '../../services/firebase';
import { Book } from '../../types';

interface AuthorTabProps {
  book: Book;
}

interface AuthorData {
  nameAuthor: string;
  imgAuthor: string;
  introduction: string;
}

export const AuthorTab: React.FC<AuthorTabProps> = ({ book }) => {
  const [authorData, setAuthorData] = useState<AuthorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAuthor() {
      const authorId = book.idAuthor?.trim();
      if (!authorId) {
        if (isMounted) {
          setAuthorData({
            nameAuthor: book.author || 'Tác giả',
            imgAuthor: book.authorImage || '',
            introduction: book.authorBio || '',
          });
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      setImageError(false);

      try {
        const authorDocRef = doc(db, FIRESTORE_COLLECTIONS.AUTHORS, authorId);
        const authorSnap = await getDoc(authorDocRef);
        if (authorSnap.exists()) {
          const data = authorSnap.data();
          if (isMounted) {
            setAuthorData({
              nameAuthor: data.nameAuthor || book.author || 'Tác giả',
              imgAuthor: data.imgAuthor || book.authorImage || '',
              introduction: data.introduction || book.authorBio || '',
            });
            setLoading(false);
          }
        } else {
          if (isMounted) {
            setAuthorData({
              nameAuthor: book.author || 'Tác giả',
              imgAuthor: book.authorImage || '',
              introduction: book.authorBio || '',
            });
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('[AuthorTab] Error fetching author from Firestore:', err);
        if (isMounted) {
          setError('Không thể tải thông tin tác giả từ hệ thống.');
          setAuthorData({
            nameAuthor: book.author || 'Tác giả',
            imgAuthor: book.authorImage || '',
            introduction: book.authorBio || '',
          });
          setLoading(false);
        }
      }
    }

    loadAuthor();
    return () => {
      isMounted = false;
    };
  }, [book.idAuthor, book.author, book.authorBio, book.authorImage]);

  const displayName = authorData?.nameAuthor || book.author || 'Tác giả';
  const displayImage = !imageError && authorData?.imgAuthor ? authorData.imgAuthor : null;
  const displayBio = authorData?.introduction || book.authorBio || 'Chưa có thông tin giới thiệu về tác giả.';

  return (
    <div
      id="tab-content-author"
      data-testid="book-details-tab-content-author"
      className="space-y-space-md"
    >
      {loading ? (
        <div className="p-space-lg text-center text-secondary font-body-md">
          Đang tải thông tin tác giả...
        </div>
      ) : (
        <>
          {error && (
            <div className="p-space-sm mb-space-md bg-error-container/20 text-error rounded-xl font-body-sm text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start gap-space-lg">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-surface-container-high shrink-0 shadow-md flex items-center justify-center">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-container text-on-primary-container">
                  <span className="material-symbols-outlined text-[48px]">person</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-headline-sm text-headline-sm font-bold text-primary mb-1">
                {displayName}
              </h3>
              <p className="font-label-md text-label-md text-secondary mb-space-sm">
                Tác giả &amp; Nhà nghiên cứu chuyên sâu
              </p>

              <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line">
                {displayBio}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
