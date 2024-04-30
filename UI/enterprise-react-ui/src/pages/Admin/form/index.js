import { Box, Button, TextField, MenuItem } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from '../../../components/Header';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { usePostUserMutation } from '~/feature/user/userApiSlice';
import { useGetAllRolesQuery } from '~/feature/role/roleApiSlice';
import { useGetAllFacultiesQuery } from '~/feature/faculty/facultyApiSlice';

const Form = () => {
    const isNonMobile = useMediaQuery('(min-width:600px)');
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        facultiesId: '',
        roleName: '',
    });

    const { data: faculties } = useGetAllFacultiesQuery();
    const { data: roles, isLoading: rolesLoading } = useGetAllRolesQuery();
    const [postUser, { isLoading, isError }] = usePostUserMutation();

    const handleFormSubmit = async (values) => {
        try {
            await postUser(values);
            setFormData({
                userName: '',
                email: '',
                phoneNumber: '',
                facultiesId: '',
                roleName: '',
            });
            isError ? toast.error('Failed to create user') : toast.success('User created successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to create user');
        }
    };

    return (
        <Box m="20px">
            <ToastContainer />
            <Header title="CREATE USER" subtitle="Create a New User Account" />

            <Formik onSubmit={handleFormSubmit} initialValues={formData} validationSchema={checkoutSchema}>
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
                            }}
                        >
                            <TextField
                                variant="filled"
                                type="text"
                                label="User Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.userName}
                                name="userName"
                                error={!!touched.userName && !!errors.userName}
                                helperText={touched.userName && errors.userName}
                                sx={{ gridColumn: 'span 4' }}
                            />
                            <TextField
                                variant="filled"
                                type="text"
                                label="Full Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.fullName}
                                name="fullName"
                                error={!!touched.fullName && !!errors.fullName}
                                helperText={touched.fullName && errors.fullName}
                                sx={{ gridColumn: 'span 4' }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name="email"
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                sx={{ gridColumn: 'span 4' }}
                            />

                            <TextField
                                fullWidth
                                variant="filled"
                                select
                                label="Faculty"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.facultiesId}
                                name="facultiesId"
                                error={!!touched.facultiesId && !!errors.facultiesId}
                                helperText={touched.facultiesId && errors.facultiesId}
                                sx={{ gridColumn: 'span 4' }}
                            >
                                {faculties ? (
                                    faculties.length === 0 ? (
                                        <MenuItem value="">Loading...</MenuItem>
                                    ) : (
                                        faculties.map((faculty) => (
                                            <MenuItem value={faculty.id}>{faculty.facultyName}</MenuItem>
                                        ))
                                    )
                                ) : (
                                    <MenuItem value="">Loading...</MenuItem>
                                )}
                            </TextField>
                            <TextField
                                fullWidth
                                variant="filled"
                                select
                                label="Role"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.roleName}
                                name="roleName"
                                error={!!touched.roleName && !!errors.roleName}
                                helperText={touched.roleName && errors.roleName}
                                sx={{ gridColumn: 'span 4' }}
                            >
                                {rolesLoading ? (
                                    <MenuItem value="">Loading...</MenuItem>
                                ) : (
                                    roles.map((role) => <MenuItem value={role.name}>{role.name}</MenuItem>)
                                )}
                            </TextField>
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            {isLoading ? (
                                <span>Loading...</span>
                            ) : (
                                <Button type="submit" color="secondary" variant="contained">
                                    Create New User
                                </Button>
                            )}
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

const checkoutSchema = yup.object().shape({
    userName: yup.string().required('required'),
    fullName: yup.string().required('required'),
    facultiesId: yup.string().required('required'),
    roleName: yup.string().required('required'),
});

export default Form;
