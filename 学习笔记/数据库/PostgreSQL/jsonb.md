

# jsonb获取值

```sql
with t1 as (
    select
    id,
    jsonb_array_elements (om.order_data) ->> 'gasType' as invno,
    cast ( jsonb_array_elements (om.order_data) ->> 'values' as INTEGER ) as invmoney
    from
    order_management om
) 
select
	id,
	string_agg ( invno,',' ) as invno,
	SUM (invmoney) as invmoney
from
	t1
group by
	id,invno
```
# 触发器
```sql
CREATE TABLE departments( 
    department_id INTEGER NOT NULL PRIMARY KEY
    , department_name CHARACTER VARYING(30) NOT NULL
) ;

CREATE TABLE employees( 
    employee_id INTEGER NOT NULL, 
    first_name CHARACTER VARYING(20),
    last_name CHARACTER VARYING(25) NOT NULL,
    email CHARACTER VARYING(25) NOT NULL, 
    phone_number CHARACTER VARYING(20),
    hire_date DATE NOT NULL, 
    salary NUMERIC(8,2), 
    commission_pct NUMERIC(2,2), 
    manager_id INTEGER, 
    department_id INTEGER,
    CONSTRAINT emp_emp_id_pk
    PRIMARY KEY (employee_id),
    CONSTRAINT emp_salary_min
    CHECK (salary > 0) , 
    CONSTRAINT emp_email_uk
    UNIQUE (email)  ,
    CONSTRAINT emp_dept_fk
    FOREIGN KEY (department_id)
    REFERENCES departments(department_id) , 
    CONSTRAINT emp_manager_fk
    FOREIGN KEY (manager_id)
    REFERENCES employees(employee_id)
) ;


create table employees_history (
    id serial primary key,
    employee_id int null,
    first_name varchar(20) null,
    last_name varchar(25) null,
    email varchar(25) null,
    phone_number varchar(20) null,
    hire_date date null,
    job_id varchar(10) null,
    salary numeric(8,2) null,
    commission_pct numeric(2,2) null,
    manager_id int null,
    department_id int null,
    action_type varchar(10) not null,
    change_dt timestamp not null
);
```
```sql
create or replace
function track_employees_change()
 returns trigger as
$$
begin
 if tg_op = 'INSERT' then
 insert into employees_history(employee_id,
                               first_name,
                               last_name,
                               email,
                               phone_number,
                               hire_date,
                               job_id,
                               salary,
                               commission_pct,
                               manager_id,
                               department_id,
                               action_type,
                               change_dt)
values(new.employee_id,
       new.first_name,
       new.last_name,
       new.email, 
       new.phone_number,
       new.hire_date,
       new.job_id,
       new.salary,
       new.commission_pct, 
       new.manager_id,
       new.department_id,
       'INSERT',
       current_timestamp);

elsif tg_op = 'UPDATE' then
 insert
	into
	employees_history(employee_id,
                      first_name,
                      last_name,
                      email,
                      phone_number,
                      hire_date,
                      job_id,
                      salary,
                      commission_pct,
                      manager_id,
                      department_id,
                      action_type,
                      change_dt)
values(old.employee_id,
       old.first_name,
       old.last_name,
       old.email, 
       old.phone_number,
       old.hire_date,
       old.job_id,
       old.salary,
       old.commission_pct, 
       old.manager_id,
       old.department_id,
       'UPDATE',
       current_timestamp);

elsif tg_op = 'DELETE' then
 insert
	into
	employees_history(employee_id,
                      first_name,
                      last_name,
                      email,
                      phone_number,
                      hire_date,
                      job_id,
                      salary,
                      commission_pct,
                      manager_id,
                      department_id,
                      action_type,
                      change_dt)
values(old.employee_id,
       old.first_name,
       old.last_name,
       old.email, 
       old.phone_number,
       old.hire_date,
       old.job_id,
       old.salary,
       old.commission_pct, 
       old.manager_id,
       old.department_id,
       'DELETE',
       current_timestamp);
end if;

return new;
end;

$$
language plpgsql;
```
```sql
create trigger trg_employees_change
 before insert or UPDATE or DELETE
 on employees
 for each row
 execute function track_employees_change();
```
 ```sql
INSERT INTO employees(employee_id, first_name, last_name, email, phone_number, 
                      hire_date, job_id, salary, commission_pct, manager_id, department_id)
values(207, 'Tony', 'Dong', 'TonyDong', '01066665678', '2020-05-25', 
       'IT_PROG', 6000, null, 103, 60);
 ```

### 一、需求背景

　　在数据库表里，一般都有主键，主键是不能重复的，因为是唯一标识。假设这个时候需求来了，需要插入一组数据，这些数据中有些是完全新的，可以直接插入（insert），但有些主键内容是和原本表内的数据主键内容是一致的，这些就无法直接插入了，而是执行更新（update）操作。这时候就比较麻烦了，因为如果全部都是通过insert操作，必然会因为发现有重复唯一主键而报错。

　　一般来说，这时候需要通过业务代码来进行判断：有重复的主键值就执行更新操作，没有就插入操作。但是PostgreSQL就提供了很好的解决方法，语法如下：

```sql
-- 1、主键id不重复就插入，否则更新
insert into 表名称 (字段a, 字段b, ...)
            values
            (value_a, value_b, ...)
            on conflict (主键id)
            do
            update set ...略

-- 2、直接绑定主键名称，主键重复则更新
insert into 表名称 (字段a, 字段b, ...)
            values
            (value_a, value_b, ...)
            on conflict on constraint this_table_key
            do
            update set ...略
```

### 二、PostgreSQL 的 upsert 简介

> PostgreSQL 的 upsert 功能：当记录不存在时，执行插入；否则，进行更新。

　　在关系数据库中，术语 upsert  被称为合并（merge），意思是，当执行 INSERT 操作时，如果数据表中不存在对应的记录，PostgreSQL  执行插入操作；如果数据表中存在对应的记录，则执行更新操作。这就是为什么将其称为 upsert（update or insert）的原因。

　　通过 INSERT ON CONFLICT 来使用 upsert 功能：

```sql
INSERT INTO table_name(column_list) VALUES(value_list)
ON CONFLICT target action;
```

1、target 可以是：

- (column_name)：一个字段名
- ON CONSTRAINT constraint_name：其中的 constraint_name 可以是一个唯一约束的名字
- WHERE predicate：带谓语的 WHERE 子句

2、action 可以是：

- DO NOTHING：当记录存在时，什么都不做
- DO UPDATE SET column_1 = value_1, … WHERE condition：当记录存在时，更新表中的一些字段

> 注意，ON CONFLICT 只在 PostgreSQL 9.5 以上可用。

### 三、PostgreSQL 的 upsert 示例

```sql
-- 我们新建一个 customers 表来进行演示：
CREATE TABLE customers (
    customer_id serial PRIMARY KEY,
    name VARCHAR UNIQUE,
    email VARCHAR NOT NULL,
    active bool NOT NULL DEFAULT TRUE
);

-- customers 表有4个字段：customer_id、name、email 和 active。
-- 其中，name 字段有唯一约束，用于确保客户的唯一性。
```

```sql
-- 下面，往 customers 表里插入几行数据：
#SELECT * FROM customers;
customer_id |   name    |         email         | active
-------------+-----------+-----------------------+--------
          1 | IBM       | contact@ibm.com       | t
          2 | Microsoft | contact@microsoft.com | t
          3 | Intel     | contact@intel.com     | t
(3 rows)
————————————————
```



　　假设 Microsoft 更换了联系方式 email：由  contact@microsoft.com 变成了 hotline@microsoft.com，我们可以使用 UPDATE  语句进行修改。然而，为了演示 upsert 功能，我们使用 INSERT ON CONFLICT 语句

```sql
INSERT INTO customers (NAME, email)
VALUES
 (
     'Microsoft',
     'hotline@microsoft.com'
 ) 
ON CONFLICT ON CONSTRAINT customers_name_key 
DO NOTHING;
```

　　这个语句指明了，当数据存在时，什么都不做(DO NOTING)。下面的语句有一样的效果，区别在于使用的是 name 字段，而不是约束的名字：

```sql
INSERT INTO customers (name, email)
VALUES
 (
     'Microsoft',
     'hotline@microsoft.com'
 ) 
ON CONFLICT (name) 
DO NOTHING;
```

　　我们的目标是修改客户的 email，所以应该用这条语句：

```sql
INSERT INTO customers (name, email)
VALUES
 (
     'Microsoft',
     'hotline@microsoft.com'
 ) 
ON CONFLICT (name) 
DO
 UPDATE
   SET email = EXCLUDED.email;
upsert
```

```sql
INSERT INTO stock_product_price (
    id,
    product_id,
    total_inventory,
    cost_price,
    total_price,
    tenant_id,
    org_id,
    org_code_path,
    status,
    creator_id,
    create_time,
    deleted
)
          select
              product_id,
              product_id,
              new_inventory,
              new_cost_price,
              new_total_price,
              tenant_id,
              org_id,
              org_code_path,
              status,
              creator_id,
              create_time,
              0
          from stock_product_price_record where id = #{recordId}
        ON CONFLICT (id)
        DO UPDATE SET
              total_inventory = (select new_inventory from stock_product_price_record where id = #{recordId}),
                                 cost_price = (select new_cost_price from stock_product_price_record where id = #{recordId}),
                                               total_price = (select new_total_price from stock_product_price_record where id = #{recordId})
```

