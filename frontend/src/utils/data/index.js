export const formatDate = (createdAt) => {
    const currentDate = new Date();
    const createdDate = new Date(createdAt);

    const timeDifferenceInSeconds = Math.floor((currentDate - createdDate) / 1000);
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
    const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
    const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

    if(timeDifferenceInDays > 1) {
        return createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (timeDifferenceInDays === 1) {
        return '1d';
    } else if (timeDifferenceInHours >= 1) {
        return `${timeDifferenceInHours}h`;
    } else if (timeDifferenceInMinutes >= 1) {
        return `${timeDifferenceInMinutes}m`;
    } else {
        return 'Just now';
    }
};

export const formatMemberSinceDate = (createdAt) => {
    const currentDate = new Date();
    const createdDate = new Date(createdAt);

    const timeDifferenceInSeconds = Math.floor((currentDate - createdDate) / 1000);
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
    const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
    const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);
    const timeDifferenceInMonths = Math.floor(timeDifferenceInDays / 30);
    const timeDifferenceInYears = Math.floor(timeDifferenceInMonths / 12);
    
    if(timeDifferenceInYears >= 1) {
        return `Joined ${timeDifferenceInYears} year${timeDifferenceInYears > 1 ? 's' : ''} ago`;
    }
    else if (timeDifferenceInMonths >= 1) {
        return `Joined ${timeDifferenceInMonths} month${timeDifferenceInMonths > 1 ? 's' : ''} ago`;
    }

    else if (timeDifferenceInDays >= 1) {
        return `Joined ${timeDifferenceInDays} day${timeDifferenceInDays > 1 ? 's' : ''} ago`;
    }
    else if (timeDifferenceInHours >= 1) {
        return `Joined ${timeDifferenceInHours} hour${timeDifferenceInHours > 1 ? 's' : ''} ago`;
    }
    else if (timeDifferenceInMinutes >= 1) {
        return `Joined ${timeDifferenceInMinutes} minute${timeDifferenceInMinutes > 1 ? 's' : ''} ago`;
    }
    else {
        return 'Joined just now';
    }
};