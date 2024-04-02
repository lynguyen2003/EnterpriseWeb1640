import { Box, Button, Snackbar, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from '../../../components/Header';
import { usePostUserMutation } from '~/feature/user/userApiSlice';
import { useState } from 'react';

const Form = () => {
    const isNonMobile = useMediaQuery('(min-width:600px)');
    const [postUser, { isLoading, isError }] = usePostUserMutation();
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        phoneNumber: '',
        facultiesId: null,
    });
    const [successMessageOpen, setSuccessMessageOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    const handleFormSubmit = async (values) => {
        try {
            await postUser(values);
            setFormData({
                userName: '',
                email: '',
                password: '',
                phoneNumber: '',
                facultiesId: null,
            });
            if (!isError) {
                setSuccessMessageOpen(true);
            } else {
                setErrorMessage(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Box m="20px">
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
                                fullWidth
                                variant="filled"
                                type="text"
                                label="User Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.userName}
                                name="userName"
                                error={!!touched.userName && !!errors.userName}
                                helperText={touched.userName && errors.userName}
                                sx={{ gridColumn: 'span 2' }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name="password"
                                error={!!touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                sx={{ gridColumn: 'span 2' }}
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
                                type="text"
                                label="Phone Number"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.phoneNumber}
                                name="phoneNumber"
                                error={!!touched.phoneNumber && !!errors.phoneNumber}
                                helperText={touched.phoneNumber && errors.phoneNumber}
                                sx={{ gridColumn: 'span 4' }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Faculty (ID Number)"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.facultiesId}
                                name="facultiesId"
                                error={!!touched.facultiesId && !!errors.facultiesId}
                                helperText={touched.facultiesId && errors.facultiesId}
                                sx={{ gridColumn: 'span 4' }}
                            />
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
            <Snackbar
                open={successMessageOpen}
                autoHideDuration={6000}
                onClose={() => setSuccessMessageOpen(false)}
                message="User created successfully."
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            />
            <Snackbar
                open={errorMessage}
                autoHideDuration={6000}
                onClose={() => setErrorMessage(false)}
                message="Failed to create user."
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            />
        </Box>
    );
};

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
    userName: yup.string().required('required'),
    password: yup.string().required('required'),
    email: yup.string().email('invalid email').required('required'),
    phoneNumber: yup.string().matches(phoneRegExp, 'Phone number is not valid').required('required'),
    facultiesId: yup.string().required('required'),
});

export default Form;
