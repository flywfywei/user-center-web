import {PageContainer} from '@ant-design/pro-components';
import '@umijs/max';
import {Card} from 'antd';
import React from 'react';
import userManage from "@/pages/Admin/UserManage";

const Admin: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        {userManage()}
      </Card>
    </PageContainer>
  );
};
export default Admin;
