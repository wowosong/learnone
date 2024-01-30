network namespace 

创建网络namespace；

ip netns add netns1

ip netns list

创建虚拟网桥：ip link add veth0 type veth peer name veth1

ip link list

ip link set veth1  netns netns1

ip link set dev veth0 up 设置网卡状态为up

ip link 查看虚拟网桥 

veth pair(Virtual Ethernet)

veth是虚拟以太网卡。veth设备总是成对，称之为veth pair。veth pair一端发送的数据会在另外一端接收。veth pair常用于network namespace之间的通信，即分别将veth pair的两端放在不同的namespace。

容器是无法访问外部网络的。需要使用网桥技术将veth pair设备接收的数据包通过某种方式转发。

veth pair设置ip地址 ifconfig veth0 10.10.20.40/24