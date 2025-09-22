"use client"
import UserInformationDetailPage from '@/components/modules/p-admin/users/UserInformationDetailPage'
import { useParams } from 'next/navigation'
import React from 'react'

export default function UserInformationDetail() {
    const params = useParams()
  const id:any = params?.id

  return (
    <>
      <UserInformationDetailPage  id={id}/>
    </>
  )
}
