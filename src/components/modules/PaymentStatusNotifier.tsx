// import { useEffect } from 'react';
// import { toast } from 'react-toastify';
// // import { echo } from '@/lib/echo';

// interface PaymentStatusNotifierProps {
//   userId: number | string;
// }

// const PaymentStatusNotifier: React.FC<PaymentStatusNotifierProps> = ({ userId }) => {
//   useEffect(() => {
//     if (!userId || !echo) return;

//     const channel = echo.private(`client.${userId}`);

//     channel.listen('.payment.success', (event: any) => {
//       toast.success(event.message);

//       // window.location.href = '/dashboard/payments/success';
//     });

//     return () => {
//       channel.stopListening('.payment.success');
//       echo.leave(`client.${userId}`);
//     };
//   }, [userId]);

//   return null;
// };

// export default PaymentStatusNotifier;
