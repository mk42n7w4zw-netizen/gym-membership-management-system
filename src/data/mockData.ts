export type MemberStatus = 'Active' | 'Pending' | 'Expired';

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: MemberStatus;
  renewal: string;
  trainer: string;
  joined: string;
};

export const stats = [
  { label: 'Active Members', value: '1,284', change: '+12.4%', trend: 'up', detail: 'vs last month' },
  { label: 'Monthly Revenue', value: '$84.8K', change: '+8.7%', trend: 'up', detail: 'across all plans' },
  { label: 'Avg. Attendance', value: '76%', change: '-2.1%', trend: 'down', detail: 'this week' },
  { label: 'Renewals Due', value: '48', change: '+5.2%', trend: 'up', detail: 'next 7 days' },
];

export const revenueData = [
  { month: 'Jan', value: 54 }, { month: 'Feb', value: 68 }, { month: 'Mar', value: 62 },
  { month: 'Apr', value: 82 }, { month: 'May', value: 74 }, { month: 'Jun', value: 90 }, { month: 'Jul', value: 88 },
];

export const classes = [
  { name: 'HIIT Burn', time: '6:30 AM', coach: 'Maya Brooks', seats: 6, intensity: 'High' },
  { name: 'Strength Lab', time: '9:00 AM', coach: 'Theo Walker', seats: 4, intensity: 'Moderate' },
  { name: 'Cycle Sprint', time: '12:15 PM', coach: 'Nina Patel', seats: 8, intensity: 'High' },
  { name: 'Mobility Flow', time: '6:00 PM', coach: 'Maya Brooks', seats: 11, intensity: 'Low' },
];

export const members: Member[] = [
  { id: 'MEM-2049', name: 'Addison Lee', email: 'addison@example.com', phone: '+1 555 0101', plan: 'Gold', status: 'Active', renewal: 'Sep 28', trainer: 'Nina Patel', joined: 'Jan 12, 2025' },
  { id: 'MEM-1187', name: 'Marcus Chen', email: 'marcus@example.com', phone: '+1 555 0102', plan: 'Platinum', status: 'Pending', renewal: 'Sep 30', trainer: 'Theo Walker', joined: 'Feb 04, 2025' },
  { id: 'MEM-3321', name: 'Riya Shah', email: 'riya@example.com', phone: '+1 555 0103', plan: 'Elite', status: 'Active', renewal: 'Oct 04', trainer: 'Maya Brooks', joined: 'Mar 19, 2025' },
  { id: 'MEM-4470', name: 'Daniel Kim', email: 'daniel@example.com', phone: '+1 555 0104', plan: 'Basic', status: 'Expired', renewal: 'Sep 11', trainer: 'Nina Patel', joined: 'Nov 28, 2024' },
  { id: 'MEM-6715', name: 'Olivia Brooks', email: 'olivia@example.com', phone: '+1 555 0105', plan: 'Gold', status: 'Active', renewal: 'Oct 08', trainer: 'Theo Walker', joined: 'Apr 02, 2025' },
  { id: 'MEM-8922', name: 'Sofia Green', email: 'sofia@example.com', phone: '+1 555 0106', plan: 'Premium', status: 'Active', renewal: 'Oct 14', trainer: 'Maya Brooks', joined: 'May 16, 2025' },
];

export const attendance = [
  { name: 'Mila Torres', time: '7:12 AM', type: 'Strength' }, { name: 'Noah Patel', time: '7:30 AM', type: 'Cardio' },
  { name: 'Emma Ross', time: '8:05 AM', type: 'Yoga' }, { name: 'Liam Foster', time: '8:15 AM', type: 'HIIT' },
];

export const paymentDue = [
  { name: 'Jasper Nash', amount: '$94.00', due: 'Today' }, { name: 'Chloe Griffin', amount: '$120.00', due: 'Tomorrow' },
  { name: 'Owen Bennett', amount: '$88.00', due: 'Thu' }, { name: 'Harper James', amount: '$142.00', due: 'Fri' },
];

export const plans = [
  { name: 'Basic', price: '$39', members: 318, features: 'Gym floor access' },
  { name: 'Gold', price: '$79', members: 496, features: 'Gym + group classes' },
  { name: 'Premium', price: '$119', members: 322, features: 'Classes + 2 PT sessions' },
  { name: 'Elite', price: '$179', members: 148, features: 'Unlimited coaching' },
];
