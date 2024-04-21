import { Box } from '@mui/material';
import Header from '~/components/Header';
import PieChart from '~/components/Chart/PieChartCount';
import { useGetStatisticsWithFacutlyQuery } from '~/feature/statistics/statisticsApiSlice';

const Pie = () => {
    const { data } = useGetStatisticsWithFacutlyQuery();
    let contributions, contributors;

    if (data) {
        contributions = data.map((faculty) => ({
            id: faculty.facultyName,
            label: faculty.facultyName,
            value: faculty.contributions,
        }));

        contributors = data.map((faculty) => ({
            id: faculty.facultyName,
            label: faculty.facultyName,
            value: faculty.contributors,
        }));
    }

    return (
        <Box m="20px">
            <Header
                title="Faculty Statistics"
                subtitle="Distribution of Contribution Counts and Contributors by Faculty"
            />
            <Box height="75vh" display="flex">
                {contributions && <PieChart data={contributions} metricName="Total Contributions" />}
                {contributors && <PieChart data={contributors} metricName="Total Contributors" />}
            </Box>
        </Box>
    );
};

export default Pie;
