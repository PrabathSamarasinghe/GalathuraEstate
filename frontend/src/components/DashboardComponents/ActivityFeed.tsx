import type { Transaction } from '../../utils/Interfaces';
import { TransactionType } from '../../utils/enums';

interface ActivityFeedProps {
  recentActivity: Transaction[];
}

const ActivityFeed = ({ recentActivity }: ActivityFeedProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Activity</h3>
      <div className="space-y-3">
        {recentActivity.length > 0 ? (
          recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                activity.type === TransactionType.INCOME ? 'bg-green-500' : 'bg-gray-400'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.category}</p>
                <p className={`text-sm font-semibold mt-1 ${
                  activity.type === TransactionType.INCOME ? 'text-green-600' : 'text-gray-700'
                }`}>
                  {activity.type === TransactionType.INCOME ? '+' : '-'}Rs. {activity.amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <svg className="w-10 h-10 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No activity today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
