import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  notificationUpdate,
  getUser,
} from "../../state/features/User/UserData/userSlice";
import { FcHighPriority, FcIdea, FcNoIdea, FcOk } from "react-icons/fc";
import { PaginationNotificationsList } from "../helpers/PaginationNotificationsList";

export const NotificationOverView = () => {
  const dispatch = useDispatch();

  // Get user data
  const { user } = useSelector((state) => state.userAuth);

  // Auto-refresh notifications from server on mount
  useEffect(() => {
    if (user?.token && user?.id) {
      dispatch(getUser({ token: user.token, id: user.id }));
    }
  }, [dispatch, user]);

  // Safe access to notifications from state
  const notifications = useSelector(
    (state) => state.userData.info?.notifications || []
  );

  const handleClick = (notification) => {
    // Check if notification has already been seen
    if (notification.isSeen) return;

    const payload = {
      notificationId: notification._id,
      token: user.token,
    };

    dispatch(notificationUpdate(payload));
  };

  const oneNotification = (notification) => {
    const isTicket =
      notification.type === "support-ticket" ||
      notification.type === "ticket-update";

    return (
      <div
        className={`max-w-xl mx-auto mt-2 px-4 sm:px-6 py-4 rounded-xl shadow w-full select-none transition ${
          isTicket
            ? notification.isSeen
              ? "bg-teal-50 border border-teal-200"
              : "bg-teal-100 border-2 border-teal-500 font-bold"
            : notification.isSeen
            ? "bg-white"
            : "bg-slate-200 border-l-4 border-blue-800"
        }`}
        key={notification._id}
      >
        <Link
          onClick={() => handleClick(notification)}
          to={`/notifications/${notification._id}`}
          className="inline-flex items-center justify-between w-full"
        >
          <div className="inline-flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/893/893257.png"
              alt="Messages Icon"
              className="w-6 h-6 mr-1"
            />
            <h3 className="font-bold text-base text-gray-800">
              {notification.title}
            </h3>
          </div>
          <p className="text-xs font-semibold text-blue-900">
            {moment(notification.createdAt).fromNow()}
          </p>
        </Link>
        <p className="flex items-center mt-1.5 text-xs text-slate-600">
          {!notification.isSeen ? (
            <>
              <span className="font-semibold text-rose-600">
                New unread notification
              </span>
              <FcHighPriority className="ml-1" size={18} />
            </>
          ) : (
            <span className="flex items-center gap-1 text-slate-400 ml-auto text-[11px]">
              <span>Read</span>
              <FcOk size={16} />
            </span>
          )}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-5xl w-full min-h-screen">
      <div className="h-full w-full">
        {/* Heading */}
        <h3 className="flex justify-center items-center text-2xl text-center font-bold px-2 py-4 mb-8 bg-blue-200 border-b-4 border-blue-800 rounded shadow">
          <FcIdea className="mr-1" size={50} />
          <span>Notifications</span>
        </h3>

        {/* If there are no notifications */}
        {notifications.length === 0 && (
          <div className="max-w-2xl w-full mx-auto my-4 flex flex-col gap-4 items-center justify-center flex-wrap bg-pink-100 p-6 border-2 border-pink-800 rounded-xl shadow">
            <FcNoIdea size={60} />
            <p className="text-gray-800 text-base font-semibold">
              You do not have any Notifications!
            </p>
          </div>
        )}

        {/* Display All Notifications */}
        {notifications.length > 0 && (
          <PaginationNotificationsList
            oneNotification={oneNotification}
            notifications={notifications.slice(0).reverse()}
            rowsPerPage={10}
          />
        )}
      </div>
    </div>
  );
};
