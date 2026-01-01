-- Tạo Database
CREATE DATABASE CoffeeShopDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE CoffeeShopDB;

-- 1. Bảng Danh mục (Cập nhật thêm cột slug để lọc)
CREATE TABLE Categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL, -- Tên hiển thị (Ví dụ: Cà phê máy)
    slug VARCHAR(50),           -- Mới: Mã dùng để lọc (Ví dụ: coffee, tea, cake)
    type ENUM('news', 'product') NOT NULL, 
    description TEXT
);

-- 2. Bảng Sản phẩm (Cập nhật thêm cột is_bestseller)
CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    description TEXT,
    image_url VARCHAR(255),
    is_bestseller BOOLEAN DEFAULT 0, -- Mới: 1 là bán chạy, 0 là bình thường
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

-- 3. Bảng Tin tức (Giữ nguyên)
CREATE TABLE News (
    news_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content LONGTEXT NOT NULL,
    author VARCHAR(100),
    image_url VARCHAR(255),
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

-- 4. Bảng Đơn hàng (Giữ nguyên)
CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address VARCHAR(255) NOT NULL,
    note TEXT,
    total_amount DECIMAL(10, 2),
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng Chi tiết đơn hàng (Giữ nguyên)
CREATE TABLE OrderDetails (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- --- PHẦN QUAN TRỌNG: DỮ LIỆU MẪU KHỚP VỚI GIAO DIỆN MỚI ---

-- 1. Thêm Danh mục (Chú ý cột slug khớp với data-filter trong HTML)
INSERT INTO Categories (name, slug, type) VALUES 
('Cà phê', 'coffee', 'product'),  -- ID 1
('Trà trái cây', 'tea', 'product'), -- ID 2
('Bánh ngọt', 'cake', 'product'),   -- ID 3
('Tin tức & Blog', 'blog', 'news'); -- ID 4

-- 2. Thêm Sản phẩm (Khớp với file app.js)
INSERT INTO Products (name, price, image_url, category_id, is_bestseller) VALUES 
('Espresso Đá', 35000, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500', 1, 1),
('Capuchino nóng', 45000, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500', 1, 0),
('Cold Brew Cam Sả', 55000, 'https://images.unsplash.com/photo-1461023058943-48dbf1399192?w=500', 1, 1),
('Trà Đào Cam Sả', 45000, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500', 2, 0),
('Bánh Croissant', 25000, 'https://images.unsplash.com/photo-1555507036-ab1f40388085?w=500', 3, 0),
('Tiramisu', 40000, 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500', 3, 1);

-- 3. Thêm Tin tức mẫu
INSERT INTO News (title, summary, content, image_url, category_id) VALUES 
('Xu hướng Cold Brew lên ngôi mùa hè', 'Cold Brew đang chinh phục giới trẻ...', 'Nội dung chi tiết về Cold Brew...', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500', 4),
('Tìm hiểu về hạt Arabica Cầu Đất', 'Hương vị đặc trưng vùng cao...', 'Nội dung chi tiết Arabica...', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500', 4);

-- 4. Bảng Người dùng (Cho chức năng đăng ký/đăng nhập và tích điểm)
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Bảng tùy chọn (Option types) và giá trị tùy chọn
CREATE TABLE OptionTypes (
    option_type_id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g., sugar, ice, topping
    label VARCHAR(100) NOT NULL
);

CREATE TABLE OptionValues (
    option_value_id INT PRIMARY KEY AUTO_INCREMENT,
    option_type_id INT,
    value_code VARCHAR(100), -- e.g., 50, 70, milkfoam
    label VARCHAR(150),
    price DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (option_type_id) REFERENCES OptionTypes(option_type_id)
);

-- 6. Bảng liên kết sản phẩm - option values (sản phẩm có thể có nhiều topping/option)
CREATE TABLE ProductOptionValues (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    option_value_id INT,
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (option_value_id) REFERENCES OptionValues(option_value_id)
);

-- VI DỤ: Thêm người dùng mẫu
INSERT INTO Users (name, phone, email, password, points) VALUES ('Nguyễn Văn A', '0123456789', 'a@example.com', 'secret', 120);

-- VI DỤ: Thêm option types và values (topping, sugar)
INSERT INTO OptionTypes (code, label) VALUES ('sugar','Độ đường'),('ice','Đá'),('topping','Topping');
INSERT INTO OptionValues (option_type_id, value_code, label, price) VALUES
(1,'0','0%',0),(1,'50','50%',0),(1,'70','70%',0),(1,'100','100%',0),
(2,'regular','Đá thường',0),(2,'less','Ít đá',0),(2,'no','Không đá',0),
(3,'milkfoam','Milk Foam','5000'),(3,'caramel','Caramel','6000'),(3,'boba','Trân châu','8000');
