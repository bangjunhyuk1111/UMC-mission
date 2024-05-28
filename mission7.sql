create table if not exists users
(
    id         int auto_increment constraint `PRIMARY`
			primary key,
    username   varchar(50)                         not null,
    email      varchar(100)                        not null,
    created_at timestamp default CURRENT_TIMESTAMP null
);


