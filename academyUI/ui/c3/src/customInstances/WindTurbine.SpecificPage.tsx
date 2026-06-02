/*
  WindTurbine.SpecificPage.tsx
*/
/*
  WindTurbine.SpecificPage.tsx
*/
import { deleteWorkOrder } from '@c3/app/ui/src/components/CRUDMethods/WorkOrderCRUD';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import React from "react";
// Add to imports at top of the file
import { UiSdlReduxState } from '@c3/types';
import { useSelectedState } from '@c3/ui/UiSdlUseData';
import { fetchTurbineById } from '@c3/app/ui/src/components/CRUDMethods/WindTurbineCRUD';
import { useEffect, useState } from 'react';
import { Grid, Box, Paper, Container } from '@mui/material';
import { Speed, Thermostat, ElectricBolt, Analytics } from '@mui/icons-material';
import WorkOrderModal from "@c3/app/ui/src/components/WorkOrderModal";

import { Tab, Tabs, Snackbar, Alert } from '@mui/material';
import { fetchWorkOrdersByTurbineId } from '@c3/app/ui/src/components/CRUDMethods/WorkOrderCRUD';
import WorkOrdersTab from '@c3/app/ui/src/components/WorkOrdersTab';

import WindTurbineHeader from '@c3/app/ui/src/components/WindTurbineHeader';
import ModernMetricCard from '@c3/app/ui/src/components/ModernMetricCard';
import TurbineDetailsTab from '@c3/app/ui/src/components/TurbineDetailsTab';
import { createWorkOrder } from '@c3/app/ui/src/components/CRUDMethods/WorkOrderCRUD';
import { upsertWorkOrderData } from '@c3/app/ui/src/components/CRUDMethods/WorkOrderCRUD';
import { fetchWorkOrderData } from '@c3/app/ui/src/components/CRUDMethods/WorkOrderCRUD';

const WindTurbineSpecificPage = () => {


    const [tabValue, setTabValue] = useState(1); // Default to second tab for convenience during development

    // Tab change on the work orders page
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const [workOrderOpen, setWorkOrderOpen] = useState(false);

    const [workOrder, setWorkOrder] = useState({
        title: '',
        description: '',
        status: 'Open',
        assignedTo: '',
        dueDate: '',
        estimatedHours: 0
    });

    // Empty Work orders handlers
    const handleCreateWorkOrder = () => {
        setWorkOrderOpen(true);
    }

    const handleWorkOrderChange = (field: string) => (event: any) => {
        setWorkOrder((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleWorkOrderClose = () => {
        setWorkOrderOpen(false);
        setWorkOrder({
            title: '',
            description: '',
            status: 'Open',
            assignedTo: '',
            dueDate: '',
            estimatedHours: 0
        });
    };

    const handleWorkOrderSave = async () => {
        if (workOrder.title && workOrder.description) {
            try {
                // Convert datetime-local format to ISO 8601 for backend
                const dueDateISO = workOrder.dueDate
                    ? new Date(workOrder.dueDate).toISOString()
                    : null;

                const workOrderData = {
                    turbineId: (turbineData as any).id,
                    title: workOrder.title,
                    description: workOrder.description,
                    status: workOrder.status,
                    assignedTo: workOrder.assignedTo,
                    estimatedHours: workOrder.estimatedHours,
                    dueDate: dueDateISO,
                    creationDate: new Date().toISOString()
                };

                await createWorkOrder(workOrderData);
                // Re-fetch to get properly structured data from the backend
                const updatedWorkOrders = await fetchWorkOrdersByTurbineId((turbineData as any).id);
                setWorkOrders(updatedWorkOrders);
                handleWorkOrderClose();
            } catch (error) {
                console.error('Error creating work order:', error);
            }
        }
    };

    const handleNumberChange = (field: string, value: number) => {
        setWorkOrder({
            ...workOrder,
            [field]: value
        });
    };
    type ImmutableReduxState = Map<keyof UiSdlReduxState, UiSdlReduxState[keyof UiSdlReduxState]>;

    const turbineDataSelector = (state: ImmutableReduxState) => {
        return state.getIn(['pageParams', 'turbineId']) || null;
    };

    const turbineIdFromState = useSelectedState(turbineDataSelector, (prev: any, next: any) => prev === next);
    const [turbineData, setTurbineData] = useState({});
    const [workOrders, setWorkOrders] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (turbineIdFromState) {
                    // Fetch turbine data using CRUD method
                    const turbineData = await fetchTurbineById(turbineIdFromState);
                    if (turbineData) {
                        setTurbineData(turbineData);
                        console.log('Fetched Turbine Data:', turbineData);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            const workOrderData = await fetchWorkOrdersByTurbineId(turbineIdFromState);
            setWorkOrders(workOrderData);
        };

        fetchData();
    }, [turbineIdFromState]);
    const [editWorkOrderOpen, setEditWorkOrderOpen] = useState(false);
    const [editingWorkOrderId, setEditingWorkOrderId] = useState<string | null>(null);

    const handleEditWorkOrderClose = () => {
        setEditWorkOrderOpen(false);
        setEditingWorkOrderId(null);
        setWorkOrder({
            title: '',
            description: '',
            status: 'Open',
            assignedTo: '',
            dueDate: '',
            estimatedHours: 0
        });
    };

    // Edit Work Order Handler - saves the edited work order data
    const handleEditWorkOrderSave = async () => {
        if (workOrder.title && workOrder.description && editingWorkOrderId) {
            try {
                await updateWorkOrders(editingWorkOrderId.toString(), workOrder);

                // Update local state with the edited work order data
                setWorkOrders((prev) => prev.map((wo) => (wo.id === editingWorkOrderId ? { ...wo, ...workOrder } : wo))); // string comparison

                handleEditWorkOrderClose();
                setSnackbarMessage('Work order updated successfully');
                setSnackbarOpen(true);
            } catch (error) {
                console.error('Failed to update work order:', error);
                // Check if it's a version conflict
                if (error.message && error.message.includes('409')) {
                    setSnackbarMessage('Version conflict: Please try the update again.');
                } else {
                    setSnackbarMessage('Failed to update work order. Please try again.');
                }

                // Keep dialog open on error so user can retry
                setSnackbarOpen(true);
            }
        }
    };

    // Edit Work Order Handler - opens the edit modal and populates it with the selected work order data
    const handleEditWorkOrder = (workOrderToEdit: any) => {
        setEditingWorkOrderId(workOrderToEdit.id);

        // Convert ISO datetime to datetime-local format for the input field
        const dueDateLocal = workOrderToEdit.dueDate
            ? new Date(workOrderToEdit.dueDate).toISOString().slice(0, 16)
            : '';

        setWorkOrder({
            title: workOrderToEdit.title,
            description: workOrderToEdit.description,
            status: workOrderToEdit.status,
            assignedTo: workOrderToEdit.assignedTo,
            dueDate: dueDateLocal,
            estimatedHours: workOrderToEdit.estimatedHours
        });
        setEditWorkOrderOpen(true);
    };

    // Function to update work orders with version conflict handling
    const updateWorkOrders = async (workOrderId: string, updatedWorkOrder: any): Promise<any> => {
        try {
            // First, fetch the latest work order data to get the current version
            const latestWorkOrderData = await fetchWorkOrderData(workOrderId);

            // Convert datetime-local format to ISO 8601 for backend
            const dueDateISO = updatedWorkOrder.dueDate
                ? new Date(updatedWorkOrder.dueDate).toISOString()
                : updatedWorkOrder.dueDate;

            // Now update with the latest data and correct version
            const updatedData = {
                ...latestWorkOrderData,
                ...updatedWorkOrder,
                dueDate: dueDateISO,
            };

            // Upsert the updated work order data
            const data = await upsertWorkOrderData(updatedData);

            console.log('Work Order Update Success:', data);

            // Update local state with the server response data (which should include our changes)
            if (data.objs && data.objs[0]) {
                setWorkOrders((prev) => prev.map((wo) => (wo.id === workOrderId ? data.objs[0] : wo)));
            } else {
                // Fallback: manually update the work order if server doesn't return updated data
                setWorkOrders((prev) =>
                    prev.map((wo) => (wo.id === workOrderId ? { ...wo, ...updatedWorkOrder } : wo))
                );
            }

            return data;
        } catch (error) {
            console.error('Error updating work order data:', error);

            if (error.message && error.message.includes('409')) {
                console.error('Unexpected version conflict even after fetching latest data');
            }

            throw error; // Re-throw to handle in handleEditWorkOrderSave
        }
    };

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteWorkOrderId, setDeleteWorkOrderId] = useState<string | null>(null);

    const handleDeleteWorkOrder = async (id: string) => {
        setWorkOrders((prev) => prev.filter((order) => order.id !== id));
        await deleteWorkOrder(id);
    };

    const handleDeleteWorkOrderClick = (id: string) => {
        setDeleteWorkOrderId(id);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirmClose = () => {
        setDeleteConfirmOpen(false);
        setDeleteWorkOrderId(null);
    };

    const handleDeleteConfirm = async () => {
        if (deleteWorkOrderId !== null) {
            await handleDeleteWorkOrder(deleteWorkOrderId);
            setSnackbarMessage('Work order deleted successfully');
            setSnackbarOpen(true);
        }
        handleDeleteConfirmClose();
    };
    return (
        <>
            <Box sx={{ minHeight: '100vh', background: 'white', position: 'relative' }}>
                <Container maxWidth="xl" sx={{ pt: 4, pb: 4, position: 'relative', zIndex: 1 }}>

                    {/* 1. Header: Shows turbine ID and status */}
                    <Box sx={{ mb: 2 }}>
                        <WindTurbineHeader turbineData={turbineData} />
                    </Box>

                    {/* 2. Metric Cards: Display key performance indicators */}
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <ModernMetricCard
                                icon={<ElectricBolt />}
                                title="Power Output"
                                value={turbineData.powerData}
                                unit=" MW"
                                colorKey="primary"
                                field="powerData"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <ModernMetricCard
                                icon={<Speed />}
                                title="Average Wind Speed"
                                value={turbineData.windSpeed}
                                unit=" m/s"
                                colorKey="secondary"
                                field="windSpeed"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <ModernMetricCard
                                icon={<Thermostat />}
                                title="Average Temperature"
                                value={turbineData.temperature}
                                unit="°C"
                                colorKey="tertiary"
                                field="temperature"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <ModernMetricCard
                                icon={<Analytics />}
                                title="Average Efficiency"
                                value={turbineData.efficiency}
                                unit="%"
                                colorKey="quaternary"
                                field="efficiency"
                            />
                        </Grid>
                    </Grid>

                    {/* 3. Details Tab: Shows metadata and additional information */}
                    <Paper className="wt-tabs-paper">
                        <Tabs value={tabValue} onChange={handleTabChange} className="wt-tabs-container">
                            <Tab label="Turbine Details" />
                            <Tab label="Work Orders" />
                        </Tabs>
                        {/* Turbine Details Tab */}
                        {tabValue === 0 && <TurbineDetailsTab turbineData={turbineData} />} {/* THIS IS FROM NB 10 */}
                        {/* Work Orders Tab */}
                        {tabValue === 1 && (
                            <WorkOrdersTab
                                workOrders={workOrders}
                                handleWorkOrderOpenModal={handleCreateWorkOrder}
                                handleEditWorkOrder={handleEditWorkOrder}
                                handleDeleteWorkOrder={handleDeleteWorkOrderClick}
                            />
                        )}
                    </Paper>

                </Container>
            </Box>

            <WorkOrderModal
                open={editWorkOrderOpen}
                workOrder={workOrder}
                onSave={handleEditWorkOrderSave}
                onClose={handleEditWorkOrderClose}
                onChange={handleWorkOrderChange}
                onNumberChange={handleNumberChange}
                isEdit={true}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteConfirmClose}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this work order? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirmClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity="success" onClose={() => setSnackbarOpen(false)} className="wt-snackbar-alert">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default WindTurbineSpecificPage;