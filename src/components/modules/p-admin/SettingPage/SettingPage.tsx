"use client"
import React, { useState } from 'react'
import LineTitle from '../LineTitle'
import EmployeeList, { AdminUser } from './EmployeeList'
import Link from 'next/link'
import AnimationTemplate from '@/components/Ui/Modals/p-admin/AnimationTemplate'
import { loadEncryptedData } from '../../EncryptData/SavedEncryptData'
import { apiRequest } from '@/libs/api'

export default function SettingPage() {
  const [showList, setShowList] = useState({
    titan_manage_setting: true,
    employee_list: true,
  });


    const [users, setUsers] = React.useState<AdminUser[]>([]);
  
    const fetchAdmins = async () => {
      try {
        const token = loadEncryptedData()?.token;
        const res = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/admins`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );
        if (res.success) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch admins:", err);
      }
    };
  
    React.useEffect(() => {
      fetchAdmins();
    }, []);

  return (
    <>
      <LineTitle
        onClick={() =>
          setShowList((prev) => ({
            ...prev,
            titan_manage_setting: !prev.titan_manage_setting,
          }))
        }
        title="TITAN Manager Setting"
      />

      {showList.titan_manage_setting && (
        <AnimationTemplate>
          <div className="flex items-center justify-center flex-wrap gap-4">
            <Link
              href="settings/permissions"
              className="w-56 h-20 flex text-white hover:text-[#1A68FF] items-center transition-all duration-400 hover:border-[#1A68FF] justify-center border-[2px] rounded-[.5rem] border-[var(--admin-border-color)]"
            >
              <span>Permission</span>
            </Link>
            <Link
              href="settings/roll"
              className="w-56 h-20 flex text-white hover:text-[#1A68FF] items-center transition-all duration-400 hover:border-[#1A68FF] justify-center border-[2px] rounded-[.5rem] border-[var(--admin-border-color)]"
            >
              <span>Roll</span>
            </Link>
            <Link
              href="settings/employee"
              className="w-56 h-20 flex text-white hover:text-[#1A68FF] items-center transition-all duration-400 hover:border-[#1A68FF] justify-center border-[2px] rounded-[.5rem] border-[var(--admin-border-color)]"
            >
              <span>Employee</span>
            </Link>
            <Link
              href="settings/configs"
              className="w-56 h-20 flex text-white hover:text-[#1A68FF] items-center transition-all duration-400 hover:border-[#1A68FF] justify-center border-[2px] rounded-[.5rem] border-[var(--admin-border-color)]"
            >
              <span>Configs</span>
            </Link>
          </div>
        </AnimationTemplate>
      )}

      <LineTitle
        onClick={() =>
          setShowList((prev) => ({
            ...prev,
            employee_list: !prev.employee_list,
          }))
        }
        title="Employee List"
      />
      {showList.employee_list && <EmployeeList users={users} refetch={fetchAdmins}/>}
    </>
  );
}
