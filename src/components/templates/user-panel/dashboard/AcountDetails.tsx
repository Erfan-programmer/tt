interface AcountDetailsPropType {
  id: number, subTitle: string, title: string
}
export default function AcountDetails(detail: { detail: AcountDetailsPropType }) {
  return (
    <div className='account-detail-wrapper flex flex-col justify-center items-start'>
      <span className='text-[var(--box-background)] text-[1rem] sm:text-[1.2rem] lg:text-[1.9rem]  dark:text-white flex justify-between items-center gap-3'>{detail.detail.title}</span>
      <span className='text-[var(--box-background)] dark:text-[#8E92BC] '>{detail.detail.subTitle}</span>
    </div>
  )
}
