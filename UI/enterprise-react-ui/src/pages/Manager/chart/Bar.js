import { Box } from '@mui/material';
import Header from '~/components/Header';
import BarChart from '~/components/Chart/BarChart';
import { useGetStatisticsQuery } from '~/feature/statistics/statisticsApiSlice';

const Bar = () => {
    const { data } = useGetStatisticsQuery();

    let transformedData, facultyNames;

    if (data) {
        // Transform the data
        transformedData = data.reduce((acc, item) => {
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
        facultyNames = [...new Set(data.map((item) => item.facultyName))];
    }

    return (
        <Box m="20px">
            <Header
                title="Contribution Statistics"
                subtitle="Distribution number of contributions within each Faculty for each academic year"
            />
            <Box height="75vh">
                {transformedData && <BarChart data={transformedData} facultyNames={facultyNames} />}
            </Box>
        </Box>
    );
};

export default Bar;
