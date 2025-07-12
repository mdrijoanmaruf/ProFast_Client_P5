import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaSearch, 
  FaCrown, 
  FaUserCheck, 
  FaUserShield,
  FaCalendarAlt,
  FaFilter,
  FaUsers,
  FaUserCog
} from 'react-icons/fa';
import useAxiosSecure from '../../../Hook/useAxiosSecure';
import Swal from 'sweetalert2';

const MakeAdmin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'admin', 'user'
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch users',
        icon: 'error',
        confirmButtonColor: '#03373D'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleRoleChange = async (userId, currentRole, userName, userEmail) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const result = await Swal.fire({
        title: `Change User Role?`,
        html: `
          <div class="text-left">
            <p><strong>User:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p><strong>Current Role:</strong> <span class="text-blue-600">${currentRole}</span></p>
            <p><strong>New Role:</strong> <span class="text-green-600">${newRole}</span></p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: newRole === 'admin' ? '#CAEB66' : '#03373D',
        cancelButtonColor: '#d33',
        confirmButtonText: `Yes, Make ${newRole.charAt(0).toUpperCase() + newRole.slice(1)}!`
      });

      if (result.isConfirmed) {
        await axiosSecure.patch(`/users/${userId}/role`, { role: newRole });
        
        Swal.fire({
          title: 'Success!',
          text: `User role has been changed to ${newRole} successfully`,
          icon: 'success',
          confirmButtonColor: '#CAEB66'
        });

        // Update local state
        setUsers(prev => prev.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        ));
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update user role',
        icon: 'error',
        confirmButtonColor: '#03373D'
      });
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaCrown className="text-yellow-500" />;
      case 'user':
        return <FaUser className="text-blue-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  const getRoleBadge = (role) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-semibold";
    switch (role) {
      case 'admin':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'user':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CAEB66]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#03373D] flex items-center gap-2 sm:gap-3">
              <FaUserCog className="text-[#CAEB66] text-xl sm:text-2xl" />
              <span className="break-words">User Management</span>
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Manage user roles and permissions
            </p>
          </div>
          <div className="bg-[#CAEB66]/10 px-3 sm:px-4 py-2 rounded-lg self-start sm:self-auto">
            <span className="text-[#03373D] font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <FaUsers className="text-sm sm:text-base" />
              {filteredUsers.length} Users
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="w-full">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="w-full sm:w-48">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins Only</option>
                <option value="user">Users Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center border border-gray-200">
          <FaUsers className="text-5xl sm:text-6xl text-gray-300 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">
            No Users Found
          </h3>
          <p className="text-gray-500 text-sm sm:text-base px-4">
            {searchTerm || roleFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'No users available in the system.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-4 sm:p-6">
                {/* Mobile Layout */}
                <div className="flex flex-col sm:hidden space-y-3">
                  {/* User Avatar and Role Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#CAEB66]/20 rounded-full flex items-center justify-center">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#03373D] line-clamp-1">
                          {user.name || 'No Name'}
                        </h3>
                      </div>
                    </div>
                    <span className={getRoleBadge(user.role)}>
                      {user.role}
                    </span>
                  </div>
                  
                  {/* User Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEnvelope className="text-[#CAEB66] flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    
                    {user.createdAt && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCalendarAlt className="text-[#CAEB66] flex-shrink-0" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleRoleChange(user._id, user.role, user.name, user.email)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 hover:transform hover:scale-[1.02] shadow-sm text-sm ${
                      user.role === 'admin'
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-[#CAEB66] text-[#03373D] hover:bg-opacity-90'
                    }`}
                  >
                    {user.role === 'admin' ? (
                      <>
                        <FaUserCheck className="text-sm" />
                        Make User
                      </>
                    ) : (
                      <>
                        <FaUserShield className="text-sm" />
                        Make Admin
                      </>
                    )}
                  </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between">
                  {/* User Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-[#CAEB66]/20 rounded-full flex items-center justify-center">
                      {getRoleIcon(user.role)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-[#03373D] truncate">
                          {user.name || 'No Name'}
                        </h3>
                        <span className={getRoleBadge(user.role)}>
                          {user.role}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-[#CAEB66]" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        
                        {user.createdAt && (
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-[#CAEB66]" />
                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ml-4">
                    <button
                      onClick={() => handleRoleChange(user._id, user.role, user.name, user.email)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:transform hover:scale-105 shadow-sm ${
                        user.role === 'admin'
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-[#CAEB66] text-[#03373D] hover:bg-opacity-90'
                      }`}
                    >
                      {user.role === 'admin' ? (
                        <>
                          <FaUserCheck className="text-sm" />
                          Make User
                        </>
                      ) : (
                        <>
                          <FaUserShield className="text-sm" />
                          Make Admin
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Total Users</p>
              <p className="text-xl sm:text-2xl font-bold text-[#03373D]">
                {users.length}
              </p>
            </div>
            <FaUsers className="text-2xl sm:text-3xl text-[#CAEB66]" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Administrators</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                {users.filter(user => user.role === 'admin').length}
              </p>
            </div>
            <FaCrown className="text-2xl sm:text-3xl text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Regular Users</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                {users.filter(user => user.role === 'user').length}
              </p>
            </div>
            <FaUser className="text-2xl sm:text-3xl text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeAdmin;