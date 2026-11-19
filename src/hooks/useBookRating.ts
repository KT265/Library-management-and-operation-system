import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, FIRESTORE_COLLECTIONS } from '../services/firebase';

export interface BookRatingResult {
  calculatedAverageRating: number;
  totalReviews: number;
  isLoading: boolean;
}

/**
 * Dynamically computes a book's average rating and review count from the Firestore "Reviews" collection.
 */
export function useBookRating(bookId: string): BookRatingResult {
  const [calculatedAverageRating, setCalculatedAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!bookId) {
      setCalculatedAverageRating(0);
      setTotalReviews(0);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const fetchRating = async () => {
      try {
        const q = query(
          collection(db, FIRESTORE_COLLECTIONS.REVIEWS),
          where('idBookReview', '==', bookId)
        );
        const snapshot = await getDocs(q);
        if (!isMounted) return;

        const count = snapshot.docs.length;
        if (count === 0) {
          setTotalReviews(0);
          setCalculatedAverageRating(0);
          return;
        }

        const sum = snapshot.docs.reduce((acc, docSnap) => {
          const rating = Number(docSnap.data().rating);
          return acc + (Number.isFinite(rating) ? rating : 0);
        }, 0);

        setTotalReviews(count);
        setCalculatedAverageRating(sum / count);
      } catch (err) {
        console.error(`[useBookRating] Error fetching rating for book ${bookId}:`, err);
        if (isMounted) {
          setTotalReviews(0);
          setCalculatedAverageRating(0);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRating();

    return () => {
      isMounted = false;
    };
  }, [bookId]);

  return { calculatedAverageRating, totalReviews, isLoading };
}

