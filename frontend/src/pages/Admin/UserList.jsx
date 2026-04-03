import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        refetch();
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      }).unwrap();
      setEditableUserId(null);
      refetch();
      toast.success("User updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error.error}
      </Message>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminMenu />

      <h1 className="text-2xl md:text-3xl font-bold mb-6">User Management</h1>

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Admin</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50 hover:text-blue-400">
                <td className="px-4 py-3 font-mono text-sm">
                  {user._id.substring(0, 8)}...
                </td>
                <td className="px-4 py-3">
                  {editableUserId === user._id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editableUserName}
                        onChange={(e) => setEditableUserName(e.target.value)}
                        className="flex-1 p-2 border rounded-lg"
                      />
                      <button
                        onClick={() => updateHandler(user._id)}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                        title="Save"
                      >
                        <FaCheck />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{user.username}</span>
                      {!user.isAdmin && (
                        <button
                          onClick={() =>
                            toggleEdit(user._id, user.username, user.email)
                          }
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editableUserId === user._id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={editableUserEmail}
                        onChange={(e) => setEditableUserEmail(e.target.value)}
                        className="flex-1 p-2 border rounded-lg"
                      />
                      <button
                        onClick={() => updateHandler(user._id)}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                        title="Save"
                      >
                        <FaCheck />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue-500 hover:underline"
                      >
                        {user.email}
                      </a>
                      {!user.isAdmin && (
                        <button
                          onClick={() =>
                            toggleEdit(user._id, user.username, user.email)
                          }
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {user.isAdmin ? (
                    <FaCheck className="text-green-500 text-xl mx-auto" />
                  ) : (
                    <FaTimes className="text-red-500 text-xl mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {!user.isAdmin && (
                    <button
                      onClick={() => deleteHandler(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
