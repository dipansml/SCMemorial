export interface Student {
  id: string;
  code: string;
  class_id: string;
  section_id: string | null;
  student_status: string;
  session_year_id: string;
  student_details_id: string;
  student_academic_history_id: string | null;
  student_documents_id: string;
  student_elective_subjects_id: string;
  student_parents_guardians_id: string;
  student_personal_details_id: string;
  student_transport_financial_id: string;
  shift: string;
  form_no: string;
  bs_id: string;
  stream_id: string;
  roll_num: string | null;

  first_name: string;
  middle_name: string;
  surname: string;

  d_o_b: string;
  gender: string;
  blood_grp: string;
  caste: string;

  image: string;
  aadhaar_no: string;
  admission_number: string | null;
  admission_date: string;

  school_house_id: string;
  promotion: string | null;
  academic_status: string;

  tc_date: string;
  admission: string;
  status: string;

  created_by: string;
  created_date: string;

  session_result_status: string;
  ad_exam_qualified: string;

  rejection_reason: string | null;
  fail_consideration: string | null;
  fail_cons_remarks: string | null;

  relative: string | null;
  relative_name: string | null;
  relative_code: string | null;
  relationship: string | null;

  comment: string | null;

  student_admit: string | null;

  tc_required: string | null;
  tc_no: string;

  pen_no: string;
  appar_id: string;

  signature: string;

  f_image: string;
  m_image: string;

  f_signature: string;
  m_signature: string;

  g_image: string;
  g_signature: string;

  stu_signature: string;

  cast_certificate: string | null;
  caste_photocopy: string | null;

  application: string;
  trans_cert: string;
  migration_cert: string;
  any_special_cert: string;

  first_elective_sub: string;
  second_elective_sub: string;
  third_elective_sub: string;
  fourth_elective_sub: string;
  fifth_elective_sub: string;
  sixth_elective_sub: string;

  last_year_marksheet: string | null;
  student_birth_certificate: string | null;

  father_id: string;
  mother_id: string;

  father_name: string;
  father_occupation: string;
  father_designation: string | null;
  father_office_address: string | null;
  father_office_phone: string | null;
  father_mobile: string;
  father_qualification: string | null;
  father_annual_income: string;
  father_aadhaar_no: string;

  mother_name: string;
  mother_occupation: string;
  mother_designation: string | null;
  mother_office_address: string | null;
  mother_office_phone: string | null;
  mother_mobile: string;
  mother_qualification: string | null;
  mother_annual_income: string;
  mother_aadhaar_no: string;

  mothers_is_gurgent: string | null;

  local_guar_name: string;
  local_guar_occupation: string;
  local_guar_stu_relation: string;
  local_guar_gender: string;
  local_guar_annual_income: string;
  local_guar_aadhaar_no: string;
  local_guar_phone: string;
  local_guar_office_phone: string;
  local_guar_address: string;

  family_earn_memb: string;
  dependent: string;

  mother_language: string;

  second_language: string;

  immunization: string;

  medical_condition: string;

  only_child: string;

  religion: string;

  nationality: string;

  bpl: string;
  bpl_number: string;

  lkg_onw_sec_lang: string;
  std_three_sec_lang: string;

  telephone_resi: string;

  pincode: string;

  permanent_address: string;

  residential_address: string | null;
  residential_phone: string | null;
  residential_mobile: string | null;

  email: string;

  whatsapp_number_one: string | null;
  whatsapp_number_two: string | null;

  bank_acc_no: string | null;
  bank_ifsc_no: string | null;

  transport_required: string | null;

  stoppage: string;

  bus_id: string;

  bus_alloted_date: string | null;

  allow_transport: string;

  deposit_refund_status: string | null;
  refund_date: string | null;
  refund_message: string | null;

  sm_refund_amount: string;

  sm_refund_date: string | null;

  allow_readmission: string;

  dmg_prd: string | null;
  dmg_prd_price: string | null;
  dmg_prd_img: string | null;

  last_ac_certificate: string | null;
  last_ac_exam_passed: string | null;
  last_ac_year: string | null;
  last_ac_board: string | null;
  last_ac_school_name: string | null;
  last_ac_roll_no: string | null;
  last_ac_max_mark: string | null;
  last_ac_marks: string | null;

  last_school_detail: string | null;

  transfer_certificate: string | null;
  marksheet: string | null;

  pre_school_tc_date: string | null;

  migration_required: string | null;
  migration_date: string | null;

  class_name: string;

  section_name: string | null;

  teacher_full_name: string | null;

  admissiondate: string;

  user_id: string;
}