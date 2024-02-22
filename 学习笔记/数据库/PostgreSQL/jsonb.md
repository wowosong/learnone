

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

