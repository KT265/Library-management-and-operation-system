import React from 'react';
import { Book } from '../../types';

interface AuthorTabProps {
  book: Book;
}

export const AuthorTab: React.FC<AuthorTabProps> = ({ book }) => {
  return (
    <div
      id="tab-content-author"
      data-testid="book-details-tab-content-author"
      className="space-y-space-md"
    >
      <div className="flex flex-col sm:flex-row items-start gap-space-lg">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-surface-container-high shrink-0 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"
            alt={book.author}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="font-headline-sm text-headline-sm font-bold text-primary mb-1">
            {book.author}
          </h3>
          <p className="font-label-md text-label-md text-secondary mb-space-sm">
            Tác giả &amp; Nhà nghiên cứu chuyên sâu
          </p>

          <p className="font-body-md text-body-md text-on-surface leading-relaxed">
            {book.authorBio ||
              `${book.author} là một chuyên gia uy tín trong lĩnh vực của mình, từng công bố nhiều chuyên khảo và nghiên cứu khoa học có giá trị thực tiễn cao.`}
          </p>
        </div>
      </div>
    </div>
  );
};
