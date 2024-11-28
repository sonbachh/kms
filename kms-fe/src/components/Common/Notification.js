import axios from 'axios';

// Hàm gọi API để thêm thông báo theo RoleId
export const addNotificationByRoleId = async (title, message, roleId) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/Notification/AddNotificationByRoleId`,
            null, // Dữ liệu body là rỗng
            {
                params: {
                    title: title,
                    message: message,
                    roleId: roleId
                },
                headers: {
                    'accept': '*/*'
                }
            }
        );
        return response.data; // Trả về dữ liệu từ phản hồi API
    } catch (error) {
        console.error('Error adding notification by RoleId:', error);
        throw error; // Ném lỗi ra để hàm gọi có thể xử lý
    }
};


// Hàm gọi API để thêm thông báo theo UserId
export const addNotificationByUserId = async (title, message, userId) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/Notification/AddNotificationByUserId`, null, {
            params: {
                title: title,
                message: message,
                userId: userId
            },
            headers: {
                'accept': '*/*'
            }
        });
        console.log('Notification added successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('There was a problem with the POST operation:', error);
        throw error;
    }
}



