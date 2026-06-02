// CREATE WorkOrderCRUD.ts

export const fetchWorkOrdersByTurbineId = async (turbineId: string): Promise<any[]> => {
    // Validate turbineId to prevent filter expression injection
    const safeIdPattern = /^[A-Za-z0-9_-]+$/;
    if (!safeIdPattern.test(turbineId)) {
        throw new Error('Invalid turbineId format');
    }

    const response = await fetch('api/8/WorkOrder/fetch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            filter: `turbineId == '${turbineId}'`, // only fetch work orders for the specified turbine
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch work orders for turbine');
    }

    const data = await response.json();
    return data.objs || [];
};



export const createWorkOrder = async (workOrderData: any): Promise<any> => {
    const response = await fetch('api/8/WorkOrder/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-request-envelope': 'true',
        },
        body: JSON.stringify({
            thisArg: workOrderData,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to create work order');
    }

    return await response.json();
};

/*
  WorkOrderCRUD.ts
*/

// ... 

export const upsertWorkOrderData = async (workOrderData: any): Promise<any> => {
    const response = await fetch('api/8/WorkOrder/upsert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-request-envelope': 'true',
        },
        body: JSON.stringify({
            args: [],
            missingArgs: [],
            thisArg: workOrderData,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to update work order data');
    }

    return await response.json();
};

export const fetchWorkOrderData = async (workOrderId: string): Promise<any> => {
    const response = await fetch('api/8/WorkOrder/fetch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            filter: `id == '${workOrderId}'`,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch work order data');
    }

    const data = await response.json();
    if (!data.objs || !data.objs[0]) {
        throw new Error('No work order data found');
    }

    return data.objs[0];
};


export const deleteWorkOrder = async (id: string): Promise<any> => {
    const response = await fetch('api/8/WorkOrder/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-request-envelope': 'true',
        },
        body: JSON.stringify({
            thisArg: { id },
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to delete work order');
    }

    return await response.json();
};