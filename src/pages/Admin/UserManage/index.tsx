import {API} from '@/services/ant-design-pro/typings';
import {PlusOutlined} from '@ant-design/icons';
import {ActionType, PageContainer, ProColumns} from '@ant-design/pro-components';
import {ProTable, TableDropdown} from '@ant-design/pro-components';
import {Button, Image, message, Space} from 'antd';
import {useRef} from 'react';
import {removeUser, searchUsers} from "@/services/ant-design-pro/api";

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

const columns: ProColumns<API.User>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    disable: true,
    title: '用户头像',
    dataIndex: 'avatarUrl',
    search: false,
    render: (_, record) => (
      <Space>
        <Image src={record.avatarUrl} width={60} height={60}/>
      </Space>
    ),
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 50,
    valueType: 'select',
    valueEnum: {
      0: {
        text: '女',
      },
      1: {
        text: '男',
      },
    },
  },
  {
    title: '角色',
    dataIndex: 'role',
    valueType: 'select',
    valueEnum: {
      0: {
        text: '普通用户',
        status: 'Default',
      },
      1: {
        text: '管理员',
        status: 'Success',
      },
    },
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    copyable: true,
  },
  {
    disable: true,
    title: '状态',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: 'select',
    valueEnum: {
      1: {
        text: '被封号',
        status: 'Error',
      },
      0: {
        text: '正常',
        status: 'Success',
      },
      2: {
        text: '其它',
        status: 'Processing',
      },
    },
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'createTime',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={async (key) => {
          if (key === 'cope'){

          }
          if (key === 'delete'){
            const result = await removeUser({id: record.id});
            if (result) message.success("删除成功！");
            action?.reload();
          }
        }}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除'},
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer>
      <ProTable<API.User>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          console.log(sort, filter);
          await waitTime(2000);
          const userList = await searchUsers({});
          return {
            data: userList,
          };
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="高级表格"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              actionRef.current?.reload();
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
    </PageContainer>
  );
};
