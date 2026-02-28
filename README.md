# 🎓 Template Báo Cáo & Trình Chiếu Khóa Học (LaTeX + HTML/JS/CSS)

Đây là một bộ khung (template) hoàn chỉnh, tự động hoá cao dành cho việc thực hiện các bài Tiểu luận, Báo cáo môn học hoặc Thuyết trình. Boilerplate này được phát triển dựa trên bài tập môn Triết học (AS5113).

Thay vì phải duy trì 2 định dạng file (Word cho báo cáo và PowerPoint cho slide) một cách cồng kềnh, template này kết hợp:
1. **LaTeX (Tài liệu In/PDF chuẩn học thuật)**: Tự động sắp xếp, chia chương, mục lục và format chuẩn Đại học Bách Khoa.
2. **HTML/JS (Slide Trình chiếu Tương tác)**: Các slide độc lập dạng file web nhẹ nhàng, hiệu ứng mượt mà.
3. **GitHub Actions (CI/CD DevOps)**: Tự động biên dịch `.tex` thành file `.pdf` và đưa website HTML lên mạng mỗi khi bạn đẩy code.

---

## �️ Yêu Cầu Chuẩn Bị (Prerequisites)

Dù hệ thống đã tự động hóa trên GitHub, nhưng để làm việc tại máy cá nhân (Local), bạn lưu ý:
* Tải và cài đặt **Git** để quản lý phiên bản.
* Trình soạn thảo khuyên dùng: **Visual Studio Code**.
  * Extension nên có: `LaTeX Workshop` (Hỗ trợ highlight cú pháp TeX), `Live Server` (Nếu muốn xem slide HTML tự động reload).
* (Tùy chọn) Cài đặt **TexLive** hoặc **MiKTeX** nếu bạn muốn dịch trực tiếp file PDF ở local để kiểm tra nhanh. Nếu không, bạn vẫn thiết kế file `.tex` bình thường và chờ GitHub biên dịch giúp.

---

## �📂 Kiến Trúc Thư Mục Cốt Lõi

```text
📁 AS5113_Sun
 ├── 📄 main.tex                 # File gốc LaTeX (Định nghĩa bìa, format, quy chế)
 ├── 📁 chapters/                # (LaTeX) Các file .tex chứa nội dung từng chương
 ├── 📄 index.html               # File gốc Slide (Trình chiếu)
 ├── 📁 sections/                # (HTML) Mỗi file .html tương đương 1 trang Slide!
 ├── 📁 css/ & 📁 js/            # Component giao diện, Logic chuyển trang
 ├── 📁 images/                  # Quản lý hình ảnh chung cho cả tài liệu và slide
 ├── 📄 start_presentation.bat   # Script chạy Slide ở Localhost (Vượt lỗi CORS)
 └── 📁 .github/workflows/       # (DevOps) Các file YAML tự động chạy Automation build CI/CD trên Github
```

---

## 🚀 Hướng Dẫn Sử Dụng (Port Sang Dự Án Mới)

Để mang bộ sườn này áp dụng cho môn học khác, bạn thực hiện qua 3 khâu ngắn gọn sau:

### 1️⃣ Khởi Tạo Mới
1. Copy toàn bộ thư mục này (Ngoại trừ thư mục `.git/`) sang chỗ mới.
2. Chạy terminal tại thư mục mới: `git init`, `git add .`, và `git commit -m "Init my new project"`.

### 2️⃣ Biên Tập Báo Cáo (LaTeX)
* **Sửa trang bìa & ds thành viên**: Mở `main.tex`, tìm phần `% ============ TRANG BÌA ============` và cập nhật Tên Đề Tài, Tên Nhóm, MSSV.
* **Viết nội dung**: Các chương tương ứng nằm trong `chapters/`. Bạn có thể tạo thêm `04_chuong_4.tex` và khai báo `\input{chapters/04_chuong_4.tex}` vào cuối `main.tex`.

### 3️⃣ Biên Tập Trình Chiếu Slide (HTML)
* Khác với PPT truyền thống, mỗi slide ở đây là MỘT tập tin HTML.
* **Thêm nội dung**: Tạo file mới trong thư mục `sections/` (VD: `sections/file_moi.html`).
* **Đăng ký Slide hiển thị BẮT BUỘC**:
  Mở `js/presentation.js`, thêm đường dẫn file HTML mới vào danh sách mảng biên dịch ở trên cùng:
  ```javascript
  const slidesList = [
      'sections/00_cover.html',
      // ... thêm slide của bạn vào đây:
      'sections/file_moi.html'
  ];
  ```
* **Cách xem thử**: Click đúp vào `start_presentation.bat` để mở slide trực tiếp (Điều này giúp bypass CORS policy khi fetch nội dung ở local). Sử dụng phím `F` hoặc Click icon Play để Fullscreen. Mũi tên Phải/Trái để qua slide.

---

## ⚙️ Thiết Lập CI/CD Tự Động (GitHub Actions)

Bộ Source này chứa sẵn "Phép thuật DevOps". Bạn KHÔNG cần phải tự cài Cài đặt phần mềm biên dịch LaTeX hay Host code web thủ công nữa.

### 🌐 1. Slide Trình Chiếu Trực Tuyến (GitHub Pages)
Mỗi khi bạn `push` code lên nhánh `main`, GitHub sẽ tự động xây trang web slide cho dự án của bạn (thông qua file `.github/workflows/pages.yml`).
* **Kích hoạt**:
  1. Đưa code lên Github repo của bạn (Make sure repo ở chế độ Public hoặc bạn có gói Pro).
  2. Vào **Settings Repo** > tab **Pages** ở menu bên trái.
  3. Ở mục **Build and deployment**, chọn **Source** là **GitHub Actions**. Chờ 2 phút, Github sẽ xuất cho bạn 1 đường Link để xem slide vĩnh viễn (Rất chuyên nghiệp để gửi giảng viên).

### 📑 2. Xuất Báo Cáo PDF tự động (Release)
Thay vì cài engine TeX nặng hàng chục GB vào máy. GitHub Actions sẽ tự động biên dịch `main.tex` thành bản `.pdf` mỗi khi có thay đổi trên nhánh `main` (chạy `.github/workflows/build.yml`).
* **Kích hoạt tùy chỉnh**:
  Bản gốc xuất ra file tên `AS5113_Nhom7_ChuNghiaKhacKi.pdf`. Bạn hãy mở tệp `.github/workflows/build.yml` và thay đổi ở 2 vị trí sau để phù hợp với dự án của bạn:
  
  **Vị trí 1 (Dòng 31):** Đổi tên file output
  ```yaml
  - name: Publish PDF to project root
    run: |
      cp main.pdf Ten_Bao_Cao_Cua_Ban.pdf 
  ```

  **Vị trí 2 (Dòng 36):** Đổi tên Artifact Zip tải về
  ```yaml
  - name: Upload artifact (PDF)
    uses: actions/upload-artifact@v4
    with:
      name: ten-bao-cao-pdf   # Đổi chỗ này
      path: Ten_Bao_Cao_Cua_Ban.pdf # KHỚP với tên ở Vị trí 1
  ```

* **Thành quả**: Cứ sau vài phút push code, bấm sang màn hình chính của Repo, cột bên phải chọn mục **Releases**, bạn sẽ thấy phiên bản mới nhất kèm link tải file PDF đã dịch sẵn gọn gàng. Build Log cũng tự động trích xuất để dò lỗi nếu có.

🌟 *Chúc bạn đạt điểm cao với Template xịn sò này!*
