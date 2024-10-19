# Note

## Quan trọng

- POST requests không có gạch ở cuối
- GET requests phải có gạch ở cuối

Nếu gặp lỗi 307 => Check lại route, thêm/bớt / ở cuối
Nếu gặp lỗi 422 ở GET => Thiếu / ở cuối 

## huynq

-   chưa có api search các màn năm học, kỳ học, khóa, lớp, môn học

## dat

### Note

- Columns của antd Table chỉ nên nhận array bình thường. Ko nên cho nó state nếu ko sẽ lỗi filter, hiển thị, internal,... Nếu cần
update cột thì cho column array tính toán lại sau mỗi state change
