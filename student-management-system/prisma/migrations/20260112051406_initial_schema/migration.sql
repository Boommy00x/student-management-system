-- CreateTable
CREATE TABLE "attendance_records" (
    "attendance_id" SERIAL NOT NULL,
    "section_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "attendance_date" DATE NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'present',
    "note" VARCHAR(255),

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("attendance_id")
);

-- CreateTable
CREATE TABLE "class_sections" (
    "section_id" SERIAL NOT NULL,
    "class_name" VARCHAR(100) NOT NULL,
    "teacher_name" VARCHAR(100),
    "start_date" DATE,
    "end_date" DATE,

    CONSTRAINT "class_sections_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "courses" (
    "course_id" SERIAL NOT NULL,
    "department_id" INTEGER NOT NULL,
    "course_code" VARCHAR(20) NOT NULL,
    "course_name_th" VARCHAR(255) NOT NULL,
    "course_name_en" VARCHAR(255),
    "credit" DECIMAL(3,1) NOT NULL,
    "lecture_hour" SMALLINT DEFAULT 0,
    "lab_hour" SMALLINT DEFAULT 0,
    "description" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "departments" (
    "department_id" SERIAL NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "name_th" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255),

    CONSTRAINT "departments_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "enrollment_id" SERIAL NOT NULL,
    "student_id" INTEGER NOT NULL,
    "section_id" INTEGER NOT NULL,
    "enroll_date" DATE NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'enrolled',
    "final_score" DECIMAL(5,2),
    "final_grade" VARCHAR(2),

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("enrollment_id")
);

-- CreateTable
CREATE TABLE "instructors" (
    "instructor_id" SERIAL NOT NULL,
    "employee_no" VARCHAR(20) NOT NULL,
    "prefix" VARCHAR(20),
    "first_name_th" VARCHAR(100) NOT NULL,
    "last_name_th" VARCHAR(100) NOT NULL,
    "first_name_en" VARCHAR(100),
    "last_name_en" VARCHAR(100),
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',

    CONSTRAINT "instructors_pkey" PRIMARY KEY ("instructor_id")
);

-- CreateTable
CREATE TABLE "programs" (
    "program_id" SERIAL NOT NULL,
    "department_id" INTEGER NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name_th" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255),
    "level" VARCHAR(20) NOT NULL DEFAULT 'Bachelor',

    CONSTRAINT "programs_pkey" PRIMARY KEY ("program_id")
);

-- CreateTable
CREATE TABLE "semesters" (
    "semester_id" SERIAL NOT NULL,
    "academic_year" SMALLINT NOT NULL,
    "term" SMALLINT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,

    CONSTRAINT "semesters_pkey" PRIMARY KEY ("semester_id")
);

-- CreateTable
CREATE TABLE "students" (
    "student_id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255),
    "enrollment_date" DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "students_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'student',
    "student_id" INTEGER,
    "instructor_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uk_attendance" ON "attendance_records"("section_id", "student_id", "attendance_date");

-- CreateIndex
CREATE UNIQUE INDEX "courses_course_code_key" ON "courses"("course_code");

-- CreateIndex
CREATE UNIQUE INDEX "departments_code_key" ON "departments"("code");

-- CreateIndex
CREATE UNIQUE INDEX "uk_student_section" ON "enrollments"("student_id", "section_id");

-- CreateIndex
CREATE UNIQUE INDEX "instructors_employee_no_key" ON "instructors"("employee_no");

-- CreateIndex
CREATE UNIQUE INDEX "programs_code_key" ON "programs"("code");

-- CreateIndex
CREATE UNIQUE INDEX "uk_semester_year_term" ON "semesters"("academic_year", "term");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "uk_user_student" ON "users"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_user_instructor" ON "users"("instructor_id");

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "fk_attendance_section" FOREIGN KEY ("section_id") REFERENCES "class_sections"("section_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "fk_attendance_student" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "fk_course_department" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "fk_enrollment_section" FOREIGN KEY ("section_id") REFERENCES "class_sections"("section_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "fk_enrollment_student" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "fk_program_department" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_user_instructor" FOREIGN KEY ("instructor_id") REFERENCES "instructors"("instructor_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_user_student" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE SET NULL ON UPDATE CASCADE;
