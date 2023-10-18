/* eslint-disable react/prop-types */
const stats = [
    {
      title: 'Revenue',
      value: '$10.1k',
      change: '2k increase',
      changeColor: 'text-green-600',
    },
    {
      title: 'New Clients',
      value: '147',
      change: '3% decrease',
      changeColor: 'text-red-600',
    },
    {
      title: 'New shifts',
      value: '55 Hours',
      change: '7% increase',
      changeColor: 'text-green-600',
    },
  ];

function DashboardStats() {
  return (
      <div className="bg-gray-200 min-h-screen w-screen">
        <div className="grid gap-4 lg:gap-2 md:grid-cols-3 p-4 pt-8">
          {stats.map((stat, index) => (
            <DashboardStat key={index} {...stat} />
          ))}
        </div>
      </div>
  );
}

function DashboardStat({ title, value, change, isPositiveChange }) {
  const changeColorClass = isPositiveChange ? 'text-green-600' : 'text-red-600';

  return (
    <div className="relative p-4 rounded-xl bg-white shadow-lg w-[350px]">
      <div className="space-y-1">
        <div className="flex items-center space-x-0 rtl:space-x-reverse text-sm font-medium text-gray-500 ">
          <span>{title}</span>
        </div>

        <div className="text-3xl">{value}</div>

        <div className={`flex items-center space-x-1 rtl:space-x-reverse text-sm font-medium ${changeColorClass}`}>
          <span>{change}</span>
          <svg
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats;
