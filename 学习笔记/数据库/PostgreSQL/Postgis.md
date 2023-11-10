```sql
 select
        om.id,
        om.order_number orderNumber,
        om.creator_name creatorName,
        om.customer_code customerCode,
        om.contact_name contactName,
        om.delivery_address_id deliveryAddressId,
        sa.address deliveryAddressName,
        om.contact_number contactNumber,
        om.delivery_station_id deliveryStationId,
        gs.name deliveryStationName,
        coalesce(om.delivery_time::varchar, '') deliveryTime,
        om.remark remark,
        om.modify_time modifyTime,
        su1.real_name modiforName,
        om.order_status orderStatus,
        om.create_time createTime,
        om."type",
        om.order_type orderType,
        su.id dispatchorId,
        case when om.order_type =1 then concat(su.real_name,'（指派') dispatchorName
        from order_management om
        left join user_order_record uor on uor.order_id=om.id and uor.deleted=0
        left join system_user su on su.id=uor.user_id and su.deleted=0
        left join system_user su1 on su1.id=om.modifier_id and su1.deleted=0
        left join safety_address sa on sa.id=om.delivery_address_id and sa.deleted=0
        left join gas_station gs on gs.id=om.delivery_station_id
        
        
        
        select distinct sc.id,sc.code from order_management om  left join safety_customer sc on sc.code=om.customer_code  where customer_id is null 
       
        
        update  order_management   set customer_id= safety_customer.id from safety_customer  where safety_customer.code=order_management.customer_code 
        
        
        
        
        select * from gas_management gm 
         
    select
	gm.id,
	gm.gas_number ,
	gm.gas_type ,
	gm.belong_unit ,
	case
		when gm.manufacture_date is not null then
        gm.manufacture_date + (gm.available_limit || ' years')::interval
	end invalidatedDate,
	gm.next_detection_time ,
	t.create_time,
	extract (days
from
	(current_date -t.create_time || 'days')::interval) sleepDays ,
	om.contact_name ,
	om.contact_number ,
	om.delivery_address_id,
	om.delivery_station_id
from
	gas_management gm
inner join lateral
        (
	select
		gdr.gas_number,
		gdr.order_id,
		gdr.create_time
	from
		gas_delivery_record gdr
		left join gas_recovery_record grr2 on gdr.gas_number =grr2.gas_number  
	where
		gdr.gas_number = gm.gas_number and gdr.create_time >grr2.create_time
	order by
		gdr.create_time desc
	) t on t.gas_number=gm.gas_number       
left join gas_limit_configure glc on glc.tenant_id = gm.tenant_id
left join order_management om on om.id = t.order_id
where current_date - t.create_time> (coalesce (glc.limit_day, 1) || ' days')::interval
         
        
select
	count(0)
from
	gas_management gm
inner join lateral(
	select
		gdr.gas_number,
		gdr.order_id,
		gdr.create_time
	from
		gas_delivery_record gdr
	where
		gdr.gas_number = gm.gas_number
	limit 1) t on
	gm.gas_number = t.gas_number
inner join lateral(
	select
		grr.gas_number,
		grr.create_time
	from
		gas_recovery_record grr
	where
		grr.gas_number = gm.gas_number
	limit 1) t1 on
	t1.gas_number = gm.gas_number
	and t.create_time > t1.create_time
left join gas_limit_configure glc on
	glc.tenant_id = gm.tenant_id
left join order_management om on
	om.id = t.order_id
where
	current_date - t.create_time > (coalesce(glc.limit_day,
	15) || ' days')::interval
        
        
        
	select
	*
from
	gas_management gm
left join lateral(
	select
		gdr.gas_number,
		gdr.order_id,
		gdr.create_time
	from
		gas_delivery_record gdr
	where
		gdr.gas_number = gm.gas_number 
		order by
        gdr.create_time desc
	limit 1) t on
	gm.gas_number = t.gas_number
inner join lateral(
	select
		grr.gas_number,
		grr.create_time
	from
		gas_recovery_record grr
	where
		grr.gas_number = gm.gas_number
	limit 1) t1 on
	t1.gas_number = gm.gas_number
	and t.create_time > t1.create_time
left join gas_limit_configure glc on
	glc.tenant_id = gm.tenant_id
left join order_management om on
	om.id = t.order_id
where
	current_date - t.create_time > (coalesce(glc.limit_day,
	15) || ' days')::interval
	
	
	
	
select
	gm.id,
	gm.gas_number,
	gm.gas_type,
	gm.belong_unit,
	case
		when gm.manufacture_date is not null then gm.manufacture_date + (gm.available_limit || ' years')::interval
	end invalidatedDate,
	gm.next_detection_time,
	t.create_time lastDelieveryTime,
	extract(days
from
	(current_date - t.create_time || 'days')::interval) sleepDays,
	om.contact_name,
	om.contact_number,
	sa.address address,
	gs.name gasStationName
from
	gas_management gm
inner join lateral(
	select
		gdr.gas_number,
		gdr.order_id,
		gdr.create_time
	from
		gas_delivery_record gdr
	where
		gdr.gas_number = gm.gas_number
	order by
		gdr.create_time desc
	limit 1) t on
	gm.gas_number = t.gas_number
inner join lateral(
	select
		grr.gas_number,
		grr.create_time
	from
		gas_recovery_record grr
	where
		grr.gas_number = gm.gas_number
	order by
		grr.create_time desc
	limit 1) t1 on
	t1.gas_number = gm.gas_number
--	and t.create_time > t1.create_time
left join gas_limit_configure glc on
	glc.tenant_id = gm.tenant_id
left join order_management om on
	om.id = t.order_id
left join safety_address sa on
	om.delivery_address_id = sa.id
left join gas_station gs on
	gs.id = om.delivery_station_id
where
	current_date - t.create_time > (glc.limit_day || ' days')::interval
limit 10

with t as (
	select
		gdr.gas_number,
		gdr.order_id,
		gdr.create_time
	from
		gas_delivery_record gdr
	 
	order by
		gdr.create_time desc
),t1 as (
	select
		grr.gas_number,
		grr.create_time
	from
		gas_recovery_record grr
	 
	order by
		grr.create_time desc
)


select
	gm.id,
	gm.gas_number ,
	gm.gas_type ,
	gm.belong_unit ,
	case
		when gm.manufacture_date is not null then
        gm.manufacture_date + (gm.available_limit || ' years')::interval
	end invalidatedDate,
	gm.next_detection_time ,
	t.create_time,
	extract (days
from
	(current_date -t.create_time || 'days')::interval) sleepDays ,
	om.contact_name ,
	om.contact_number ,
	om.delivery_address_id,
	om.delivery_station_id
from
	gas_management gm
inner join lateral
        (
	select
		gdr.gas_number,
		gdr.order_id,
		gdr.create_time
	from
		gas_delivery_record gdr
	where
		gdr.gas_number = gm.gas_number
	order by
		gdr.create_time desc
	limit 1 ) t
        on
	gm.gas_number = t.gas_number
inner join lateral (
	select
		grr.gas_number,
		grr.create_time
	from
		gas_recovery_record grr
	where
		grr.gas_number = gm.gas_number
	order by
		grr.create_time desc
	limit 1) t1 on
	t1.gas_number = gm.gas_number
	and t.create_time > t1.create_time
left join gas_limit_configure glc on
	glc.tenant_id = gm.tenant_id
left join order_management om on
	om.id = t.order_id
where
	current_date - t.create_time> (coalesce (glc.limit_day,
	1) || ' days')::interval
	and gm.status =1
	
	
	select * from gas_delivery_record gdr left join gas_recovery_record grr 
	on gdr.gas_number =grr.gas_number 
	and gdr.create_time <grr.create_time 
	
	
	
	
	
	select
	ghr.id ,
	ghr.handle_method ,
	ghr.handle_content ,
	ghr.handle_result ,
	su1.real_name handlePerson,
	ghr.create_time handleDate,
	su.real_name modiforName
from
	gas_handle_record ghr
left join "system_user" su on
	ghr.modifier_id = su.id
left join "system_user" su1 on
	su1.id = ghr.handle_person
	where ghr.gas_id =''
	
	
	
	
	
	
select
	distinct t.id,
	t.creator_name creatorName,
	t.offCarTime,
	t.onCarTime,
	t.gasNumber,
	t.gasType,
	case
		when om.type = 2 then om.type || t.type
		else t.type
	end,
	cm.car_number carNumber,
	cm.location_device_id locationDeviceId,
	om.contact_name contactName,
	om.contact_number contactNumber,
	om.order_number orderNumber,
	sa.address address,
	oda.file_url fileUrl,
	gs."name" gasStationName,
	gm.factory_code factorycode
from
	(
	select
		gdr.id,
		gdr.order_id orderId,
		gdr.gas_number gasNumber,
		gdr.gas_type gasType,
		gdr.creator_name,
		gdr.creator_id,
		gdr.car_id carId,
		cgr.create_time oncarTime,
		gdr.create_time offcarTime,
		'0' as type
	from
		gas_delivery_record gdr
	left join car_gas_record cgr on
		gdr.business_id = cgr.business_id
		and gdr.gas_number = cgr.gas_number
	where
		1 = 1
		and gdr.gas_number like concat('%',
		'00026001',
		'%')
union all
	select
		grr.id,
		grr.order_id orderId,
		grr.gas_number gasNumber,
		grr.gas_type gasType,
		grr.creator_name,
		grr.creator_id,
		grr.car_id carId,
		grr.create_time oncarTime,
		grr.modify_time offcarTime,
		'1' as type
	from
		gas_recovery_record grr
	where
		1 = 1
		and grr.gas_number like concat('%',
		'00026001',
		'%')) t
left join order_management om on
	t.orderId = om.id
	and om.tenant_id = 'ab20e93542d346b7866c6606c1a0d455'
left join gas_station gs on
	gs.id = om.delivery_station_id
	and gs.tenant_id = 'ab20e93542d346b7866c6606c1a0d455'
left join car_management cm on
	t.carId = cm.id
	and cm.tenant_id = 'ab20e93542d346b7866c6606c1a0d455'
left join safety_address sa on
	om.delivery_address_id = sa.id
left join order_dispatch_attach oda on
	oda.business_id = om.id
	and oda.type = 1
left join gas_management gm on
	gm.gas_number = t.gasNumber
	and gm.deleted = 0
	and gm.tenant_id = 'ab20e93542d346b7866c6606c1a0d455'
where
	1 = 1
limit 10







 select
	distinct t.id,
	t.creator_name creatorName,
	t.offCarTime,
	t.onCarTime,
	t.gasNumber,
	t.gasType,
	case
		when om.type = 2 then om.type || t.type
		else t.type
	end ,
	cm.car_number carNumber,
	cm.location_device_id locationDeviceId,
	om.contact_name contactName,
	om.contact_number contactNumber,
	om.order_number orderNumber,
	sa.address address,
	oda.file_url fileUrl,
	gm.manufacturing_unit manufacturingUnit,
	gm.belong_unit belongUnit,
	gm.manufacture_date manufactureDate,
	gm.last_detection_time lastDetectionTime,
	gm.next_detection_time nextDetectionTime,
	case
		when gm.manufacture_date is not null then
        gm.manufacture_date + (gm.available_limit || ' years')::interval
	end invalidatedDate,
	gs."name" gasStationName,
	gm.factory_code factorycode
from
	(
	select
		gdr.id,
		gdr.order_id orderId,
		gdr.gas_number gasNumber,
		gdr.gas_type gasType,
		gdr.creator_name,
		gdr.creator_id,
		gdr.car_id carId,
		cgr.create_time oncarTime,
		gdr.create_time offcarTime,
		'0' as type
	from
		gas_delivery_record gdr
	left join car_gas_record cgr on
		gdr.business_id = cgr.business_id
		and gdr.gas_number = cgr.gas_number
	where
		1 = 1
		and gdr.order_id = '122'
union all
	select
		grr.id,
		grr.order_id orderId,
		grr.gas_number gasNumber,
		grr.gas_type gasType,
		grr.creator_name ,
		grr.creator_id ,
		grr.car_id carId,
		grr.create_time oncarTime ,
		grr.modify_time offcarTime,
		case
			when grr.order is null then '2'
			else '1'
		end as type
	from
		gas_recovery_record grr
	where
		1 = 1
		and grr.order_id = '123' 
        ) t
left join order_management om on
	t.orderId = om.id
left join gas_station gs on
	gs.id = om.delivery_station_id
left join car_management cm on
	t.carId = cm.id
left join safety_address sa on
	om.delivery_address_id = sa.id
left join order_dispatch_attach oda on
	oda.business_id = om.id
	and oda.type = 1
left join gas_management gm on
	gm.gas_number = t.gasNumber
	and gm.deleted = 0
where
	1 = 1
	and om.id =?
	and t.type != '2'
	
	
	
	 刷新所有的订单状态 
	 update order_management  set order_status =order_status -1 where order_status !=0

	 
	 
	 select
        gm.id,
        gm.gas_number ,
        gm.gas_type ,
        gm.belong_unit ,
        to_char(case
        when gm.manufacture_date is not null then
        gm.manufacture_date + (gm.available_limit || ' years')::interval
        end ,'yyyy-MM')invalidatedDate,
        to_char(gm.next_detection_time,'yyyy-MM') ,
        t.create_time lastDelieveryTime,
        extract (days from (current_timestamp -t.create_time ||'days')::interval) sleepDays ,
        om.contact_name ,
        om.contact_number ,
        sa.address address,
        gs.name gasStationName
        from
        gas_management gm
        inner join lateral
        (
        select
        gdr.gas_number,
        gdr.order_id,
        gdr.create_time
        from
        gas_delivery_record gdr
        where gdr.gas_number = gm.gas_number
        and gdr.create_time >=( select max(gdr.create_time) from gas_delivery_record gdr
        where
        gdr.gas_number = gm.gas_number) ) t
        on gm.gas_number = t.gas_number
        inner join lateral (select
        grr.gas_number,
        grr.create_time
        from
        gas_recovery_record grr
        where
        grr.gas_number = gm.gas_number and grr.create_time >=( select max(grr.create_time) from gas_recovery_record grr
        where
        grr.gas_number = gm.gas_number)) t1 on t1.gas_number = gm.gas_number and t.create_time > t1.create_time
        left join gas_limit_configure glc on
        glc.tenant_id = gm.tenant_id
        left join order_management om on
        om.id = t.order_id
        left join safety_address sa on om.delivery_address_id=sa.id
        left join gas_station gs on gs.id=om.delivery_station_id
        where
            current_timestamp - t.create_time>(coalesce (glc.limit_day, 0) || ' days')::interval
            and gm.status =1

	 update
	car_management
set
	org_id = gas_station.org_id,
	org_code_path = gas_station.org_code_path ,
	tenant_id =gas_station.tenant_id
from
	gas_station
where
	gas_station.id = car_management.gas_station_id
	
	
	
	
	select count(gm.id),gm.gas_type  from gas_management gm where gm.deleted =0 group  by gm.gas_type  ;

 select gm.gas_type gasType, count(gm.id)
        from gas_management gm
        where gm.deleted = 0
        group by gm.gas_type order  by gm.gas_type 
        
        
        
         select gm.gas_type  as name, count(gm.id) as  value
        from gas_management gm
        where gm.deleted = 0
        group by gm.gas_type
        order by gm.gas_type;
       
       CASE
 WHEN e.salary < 5000 THEN '低'
 WHEN e.salary < 15000 THEN '中'
 ELSE '高'
 END AS salary_level
       select  case when gm.status=0 then '未使用' else '已使用' end ,count(gm.id) from gas_management gm  where gm.deleted =0 group  by gm.status ;
	
      
      
      
       if (row.discardStatus == 1) {
                return "报废";
            } else {
                if (row.invalidatedDate && row.nextDetectionTime && row.invalidatedDate > moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
                    && row.nextDetectionTime > moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")) {
                    return "正常";
                } else if (row.invalidatedDate && row.invalidatedDate < moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")) {
                    return "逾期未报废"
                } else if (row.nextDetectionTime && row.nextDetectionTime < moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")) {
                    return "逾期未检测";
                } else {
                    return "未知";
                }
            }
            
            
            select case when gm.discard_status::integer =1 then '报废'  
            when gm.manufacture_date is not null and gm.manufacture_date + (gm.available_limit || ' years')::interval> current_timestamp 
             and gm.next_detection_time  > current_timestamp then '正常'
             when gm.manufacture_date is not null and gm.manufacture_date + (gm.available_limit || ' years')::interval< current_timestamp
             then '逾期未报废'
             when gm.next_detection_time is not null and gm.next_detection_time  <current_timestamp then '逾期未检测'
            else '未知'   end as name
            , count(*)  as value 
            from gas_management gm group by name;
            
           
           select case when count(gdr.gas_number)=0 then '0次' when count(gdr.gas_number)>1 and count(gdr.gas_number)<3 then '1到3次' else '其他' end as value from gas_management gm 
           left join gas_delivery_record gdr  on gdr.gas_number =gm.gas_number  group by gm.gas_number 
           
           
           
           
select
	
	string_agg(t.gas_type,
	','),
	concat(string_agg( distinct t.value,
	','),',',string_agg(coalesce(t.value1,'0')::varchar,','))
from
	(
	select
		t.value,
		gm.gas_type,
		count(gm.gas_number) value1
	from
		(
		select
			case
				when count(gdr.gas_number)>=1 and count(gdr.gas_number)<= 3 then '1到3次'
				when count(gdr.gas_number)>=4 and count(gdr.gas_number)<= 8 then '4到8次'
				when count(gdr.gas_number)>=9 and count(gdr.gas_number)<= 12 then '9到12次'
				when count(gdr.gas_number)>=12 and count(gdr.gas_number)<= 20 then '12到20次'
				when count(gdr.gas_number)>=20  then '20次以上'
				else '0次'
			end as value,
			gm.gas_number gasNumber
		from
			gas_delivery_record gdr
		right join gas_management gm on
			gdr.gas_number = gm.gas_number
		group by
			gm.gas_number) t
	left join gas_management gm
           on
		gm.gas_number = t.gasnumber
	group by
		t.value,
		gm.gas_type order by gm.gas_type  ) t
group by
	t.value
           
	
	-- 近一周,每一天起止时间
explain select count(om.id) as  value , to_char(t.startdate, 'YYYY-MM-DD') as startdate from (select generate_series startDate,generate_series + interval '1 day' endDate
from generate_series( NOW()::date +  interval '  -6 day', now()::timestamp ,  '1day'))t left join order_management om on to_char(t.startdate, 'YYYY-MM-DD')=to_char(om.create_time, 'YYYY-MM-DD')
group  by t.startdate order  by t.startdate asc;
           


select count(gdr.id) as  value,gdr.gas_type ,to_char(t.startdate, 'YYYY-MM-DD') as startdate from (select generate_series startDate,generate_series + interval '1 day' endDate
from generate_series( NOW()::date +  interval '  -226 day', now()::timestamp ,  '1day'))t
left join gas_delivery_record gdr  on to_char(t.startdate, 'YYYY-MM-DD')=to_char(gdr.create_time, 'YYYY-MM-DD')
group  by t.startdate,gdr.gas_type  order  by t.startdate asc;
           
           
select count(om.id) as  value , gs.name,string_agg(om.create_time::varchar ,',')    from order_management om  
left join gas_station gs on gs.id=om.delivery_station_id 
where om.create_time >current_date - '1year'::interval 
group  by om.delivery_station_id,gs.name;
             
	select * from order_management om where  om.create_time >current_timestamp -'1 years'::interval 
	
	
		select * from order_management om where om.order_status =2 and om.create_time >current_timestamp -'3 months'::interval  group by  

           
	select count(t.createtime) from (select date_trunc( 'day', om.create_time) createtime  from order_management om where  om.create_time >current_timestamp -'7 days'::interval)t
	group  by t.createtime
           
           先按次数分组 再按气瓶类型分组
           
        ['product', 'YSP12', 'YSP35.5', 'YSP118'],
        ['0次', 43.3, 85.8, 93.7],
        ['1-3次', 83.1, 73.4, 55.1],
        ['4-8次', 86.4, 65.2, 82.5],
        ['5-12次', 72.4, 53.9, 39.1],
        ['12-20次', 32.4, 54.9, 19.1],
        ['20次以上', 22.4, 43.9, 59.1]
           
           
explain select
	count(gdr.id) as value,
	gdr.gas_type gasType,
	to_char(t.startdate,
	'YYYY-MM-DD') as startdate
from
	(
	select
		generate_series startDate,
		generate_series + interval '1 day' endDate
	from
		generate_series(NOW()::date + interval ' -6 day',
		now()::timestamp,
		'1day')) t
left join lateral (select gdr.id,gdr.gas_type,gdr.create_time from gas_delivery_record gdr
inner join gas_management gm on
	gm.gas_number = gdr.gas_number
where
	gm.deleted = 0
	and gm.discard_status = 0 and  gdr.create_time > t.startdate
	and gdr.create_time < t.enddate) gdr on gdr.create_time > t.startdate
	and gdr.create_time < t.enddate
group by
	t.startdate,
	gdr.gas_type
order by
	t.startdate asc
           
	
	
select
	count(om.id) as value,
	gs.name
from
	order_management om,gas_station gs  
	
where
  gs.id = om.delivery_station_id and
	om.create_time > current_date - '7days'::interval
--	and om.tenant_id = 'da9e60ef74e646a199fe4c301936d953'
group by
	gs.id,
	gs.name
	select
	count(om.id),
	gs.name
from
	gas_station gs
left join order_management om on
	gs.id = om.delivery_station_id
	
group by
	gs.name
	
select
	gdr.gas_type,
	count(gdr.gas_number) as value,
	gs.name
from
	gas_station gs
left join order_management om on
	gs.id = om.delivery_station_id
	and om.tenant_id = 'da9e60ef74e646a199fe4c301936d953'
left join gas_delivery_record gdr on
	om.id = gdr.order_id
	and om.deleted = 0
	and gdr.create_time > current_timestamp - '7day'::interval
	and gs.tenant_id = 'da9e60ef74e646a199fe4c301936d953'
group by
	gdr.gas_type,
	gs.name
order by
	gs.name,
	gdr.gas_type
	
select
	count(gdr.id) as value,
	gdr.gas_type gasType,
	to_char(t.startdate,
	'YYYY-MM-DD') as startdate
from
	(
	select
		generate_series startDate,
		generate_series + interval '1 day' endDate
	from
		generate_series(NOW()::date + interval ' -6 day',
		now()::timestamp,
		'1day')) t
left join lateral(
	select
		gdr.id,
		gdr.gas_type,
		gdr.create_time
	from
		gas_delivery_record gdr
	inner join gas_management gm on
		gm.gas_number = gdr.gas_number
--		and gm.tenant_id = 'da9e60ef74e646a199fe4c301936d953'
	where
		gm.deleted = 0
		and gm.discard_status = 0
		and gdr.create_time > t.startdate
		and gdr.create_time < t.enddate) gdr on
	gdr.create_time > t.startdate
	and gdr.create_time < t.enddate
group by
	t.startdate,
	gdr.gas_type
order by
	t.startdate asc
	
	ALTER TABLE gas_management 
ADD COLUMN filling_material VARCHAR(50) DEFAULT 'yhq'




select  ST_AsText(ST_Centroid(t1.lnglats)) from (select ST_AsText(ST_Centroid(st_union(t.lnglat))) lnglats from ( select sa.id id,
        coalesce(sa.address_position, sap.avg_position)
                  as lnglat
        from safety_address sa
                 left join safety_customer sc on
            sa.customer_id = sc.id
                 left join safety_address_position sap on sap.address_id = sa.id
        where (sa.address_position is not null or sap.avg_position is not null)
          and sa.deleted = 0
          and sc.deleted = 0)t) t1,
          
          
          
          select  ST_AsText(t1.lnglats) from (select st_union(t.lnglat) lnglats from ( select sa.id id,
        coalesce(sa.address_position, sap.avg_position)
                  as lnglat
        from safety_address sa
                 left join safety_customer sc on
            sa.customer_id = sc.id
                 left join safety_address_position sap on sap.address_id = sa.id
        where (sa.address_position is not null or sap.avg_position is not null)
          and sa.deleted = 0
          and sc.deleted = 0)t) t1,
          
          
          SELECT ST_AsText(ST_Centroid(
          
          SELECT ST_AsText(ST_Centroid('MULTIPOINT ( -1 0, -1 2, -1 3, -1 4, -1 7, 0 1, 0 3, 1 1, 2 0, 6 0, 7 8, 9 8, 10 6 )'))
          select  st_geogfromtext('MULTIPOINT ( -1 0, -1 2, -1 3, -1 4, -1 7, 0 1, 0 3, 1 1, 2 0, 6 0, 7 8, 9 8, 10 6 )');
          
         select  ST_Centroid(select array_agg(t.lnglat)  from ( select sa.id id,
        replace(replace(replace(st_astext(coalesce(sa.address_position, sap.avg_position)), 'POINT(', ''), ' ',
                               ','), ')', '') as lnglat 
        from safety_address sa
                 left join safety_customer sc on
            sa.customer_id = sc.id
                 left join safety_address_position sap on sap.address_id = sa.id
        where (sa.address_position is not null or sap.avg_position is not null)
          and sa.deleted = 0
          and sc.deleted = 0)t) t1,
          
          
          
          
          
         from ( 
       select t.lnglat from ( select sa.id id,
        coalesce(sa.address_position, sap.avg_position)
                  as lnglat
        from safety_address sa
                 left join safety_customer sc on
            sa.customer_id = sc.id
                 left join safety_address_position sap on sap.address_id = sa.id
        where (sa.address_position is not null or sap.avg_position is not null)
          and sa.deleted = 0
          and sc.deleted = 0)t  group  by t.lnglat)t
```

