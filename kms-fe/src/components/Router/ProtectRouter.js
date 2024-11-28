import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getSession } from "../Auth/Auth";

// Utility function to get token and roleId
const getAuthDetails = () => {
    const user = getSession('user'); // Assuming the user details (like roleId) are stored here
    if (user) {
        return { user, roleId: user.user.roleId }; // Returns roleId if available
    }
    return { user: null, roleId: null }; // Returns null if not logged in
};

// Higher-order component to protect routes based on role
const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
    const { user, roleId } = getAuthDetails();

    return (
        <Route
            {...rest}
            render={(props) =>
                user && allowedRoles.includes(roleId) ? (
                    <Component {...props} />
                ) : !user ? (
                    <Redirect to={`${process.env.PUBLIC_URL}/login`} /> // Not authenticated
                ) : (
                    <Redirect to={`${process.env.PUBLIC_URL}/page404`} /> // Authenticated but role not allowed
                )
            }
        />
    );
};

export default ProtectedRoute;
