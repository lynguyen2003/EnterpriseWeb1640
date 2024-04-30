import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { tokens } from '~/theme';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PublishIcon from '@mui/icons-material/Publish';
import Header from '~/components/Header';
import BarChart from '~/components/Chart/BarChart';
import PieChart from '~/components/Chart/PieChart';
import StatBox from '~/components/StatBox';
import {
    useGetStatisticsWithFacutlyQuery,
    useGetStatisticsUsersQuery,
    useGetStatisticsApprovedContributionsQuery,
    useGetStatisticsQuery,
} from '~/feature/statistics/statisticsApiSlice';

const ManagerDashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { data: statCountUsers } = useGetStatisticsUsersQuery();
    const { data: statCountApprovedContributions } = useGetStatisticsApprovedContributionsQuery();

    const { data: statPieData } = useGetStatisticsWithFacutlyQuery();
    let contributions, totalContributions, totalContributors;

    if (statPieData) {
        totalContributions = statPieData.reduce((total, item) => total + item.contributions, 0);
        totalContributors = statPieData.reduce((total, item) => total + item.contributors, 0);
        contributions = statPieData.map((faculty) => ({
            id: faculty.facultyName,
            label: faculty.facultyName,
            value: faculty.contributions,
        }));
    }

    const { data: statBarData } = useGetStatisticsQuery();
    let barData, facultyNames;

    if (statBarData) {
        // Transform the data
        barData = statBarData.reduce((acc, item) => {
            const existingItem = acc.find((i) => i.academicYear === item.academicYear);
            if (existingItem) {
                existingItem[item.facultyName] = item.contributions;
            } else {
                acc.push({
                    academicYear: item.academicYear,
                    [item.facultyName]: item.contributions,
                });
            }
            return acc;
        }, []);

        // Get all unique faculty names
        facultyNames = [...new Set(statBarData.map((item) => item.facultyName))];
    }

    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header
                    title="MANAGER DASHBOARD"
                    subtitle=" Welcome to the Manager Dashboard. Here you can view the statistics of the contributions."
                />
            </Box>

            {/* GRID & CHARTS */}
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
                {/* ROW 1 */}
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={totalContributions ? totalContributions.toString() : ''}
                        subtitle="Total Contributions"
                        progress="0.75"
                        icon={<ArticleIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={totalContributors ? totalContributors.toString() : ''}
                        subtitle="Contributors"
                        progress="0.50"
                        icon={<PersonIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={statCountUsers ? statCountUsers.toString() : ''}
                        subtitle="Users"
                        progress="0.30"
                        icon={<CheckBoxIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={statCountApprovedContributions ? statCountApprovedContributions.toString() : ''}
                        subtitle="Approved Contributions"
                        progress="0.80"
                        icon={<PublishIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
                    />
                </Box>

                {/* ROW 2 */}
                <Box gridColumn="span 8" gridRow="span 2" backgroundColor={colors.primary[400]}>
                    <Box mt="25px" p="0 30px" display="flex " justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h3" fontWeight="600" color={colors.grey[100]}>
                                Academic Year Contribution Statistics
                            </Typography>
                            <Typography variant="h5" fontWeight="400" color={colors.greenAccent[500]}>
                                Distribution of Contribution Counts by Faculty
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton>
                                <DownloadOutlinedIcon sx={{ fontSize: '26px', color: colors.greenAccent[500] }} />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box height="250px" m="-20px 0 0 0">
                        {barData && <BarChart isDashboard={true} data={barData} facultyNames={facultyNames} />}
                    </Box>
                </Box>
                <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]}>
                    <Box
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom={`3px solid ${colors.primary[500]}`}
                        colors={colors.grey[100]}
                        p="15px"
                    >
                        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                            Faculty Contribution Statistics
                        </Typography>
                    </Box>
                    {contributions && <PieChart data={contributions} isDashboard={true} metricName="contributions" />}

                    {/* <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom={`4px solid ${colors.primary[500]}`}
                        colors={colors.grey[100]}
                        p="15px"
                    >
                        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                            Recent Transactions
                        </Typography>
                    </Box>
                    {mockTransactions.map((transaction, i) => (
                        <Box
                            key={`${transaction.txId}-${i}`}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`4px solid ${colors.primary[500]}`}
                            p="15px"
                        >
                            <Box>
                                <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                                    {transaction.txId}
                                </Typography>
                                <Typography color={colors.grey[100]}>{transaction.user}</Typography>
                            </Box>
                            <Box color={colors.grey[100]}>{transaction.date}</Box>
                            <Box backgroundColor={colors.greenAccent[500]} p="5px 10px" borderRadius="4px">
                                ${transaction.cost}
                            </Box>
                        </Box>
                    ))} */}
                </Box>

                {/* ROW 3 */}
                {/* <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} p="30px">
                    <Typography variant="h5" fontWeight="600"></Typography>
                    <Box display="flex" flexDirection="column" alignItems="center" mt="25px"></Box>
                </Box>
                <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]}>
                    <Typography variant="h5" fontWeight="600" sx={{ padding: '30px 30px 0 30px' }}></Typography>
                    <Box height="250px" mt="-20px"></Box>
                </Box>
                <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} padding="30px">
                    <Typography variant="h5" fontWeight="600" sx={{ marginBottom: '15px' }}></Typography>
                    <Box height="200px"></Box>
                </Box> */}
            </Box>
        </Box>
    );
};

export default ManagerDashboard;
