insert into users
(user_no, user_id, password, name, join_date, user_group, is_deleted, is_activated)
values
-- password = 1234
('100000', 'admin', '$2a$10$A9mBA/wq/FfzzuLD/xQxnOXZSJVP1bhVWL.GsKwyY8q8iJua3sO/S', 'adminName', '1689890094', 'Admin', 'false', 'true'),
('100001', 'member', '$2a$10$A1HZn/uVytR0m98dYokGNOWHxAuQiMwSGLJi5HHdXh1fQJZ4UVcZu', 'memberName', '1689987600', 'Member', 'false', 'true'),
('100002', 'shelter', '$2a$10$A9mBA/wq/FfzzuLD/xQxnOXZSJVP1bhVWL.GsKwyY8q8iJua3sO/S', 'shelterName', '1689890094', 'Shelter', 'false', 'true');

insert into admin
(user_no)
values
('100000');

insert into member
(user_no, holding_token, adopted)
values
('100001', '0', 'false');

insert into shelter
(user_no, regist_image_path)
values
('100002', '/image/path.jpg');

insert into charge
(charge_no, member_no, tid, charge_value, charge_time)
values
('100000', '100001', 't1231231234', '10000', '16849213');