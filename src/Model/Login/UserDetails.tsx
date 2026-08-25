export interface UserDetails {
  id: string;
  code: string;
  class_id: string;
  section_id: string | null;
  student_status: string;
  session_year_id: string;

  first_name: string;
  middle_name: string;
  surname: string;

  d_o_b: string;
  gender: string;
  blood_grp: string;

  caste: string;
  image: string;

  admission_date: string;
  admission: string;
  status: string;

  father_name: string;
  father_mobile: string;

  mother_name: string;
  mother_mobile: string;

  permanent_address: string;

  class_name: string;
  section_name: string | null;

  // 👉 Keep rest optional to avoid overload
  [key: string]: any;
}