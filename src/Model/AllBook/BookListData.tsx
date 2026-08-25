export interface Book {
  id: string;
  book_edition: string;
  isbn: string;
  billno: string;
  bookname: string;
  bookauthor: string;
  bookpublisher: string;
  entrydate: string;
  numberbook: string;
  class_id: string;
  access_no: string;
  book_cat_id: string;
  created_date: string;
  student_code: string;
  student_name: string;
  student_phone: string;
  price: string;
  language: string;
  subject: string;
  type: string;
  remarks: string | null;
  is_latest: string;
  class_name: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface BookListData {
  all_books: Book[];
  totalbookcount: string,
  totallatestbookcount: string,
  pagination: Pagination;
}

export interface BookListResponse {
  status: number;
  message: string;
  data: BookListData;
}