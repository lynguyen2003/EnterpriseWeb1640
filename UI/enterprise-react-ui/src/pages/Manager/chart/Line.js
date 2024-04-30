import { Box } from '@mui/material';
import Header from '~/components/Header';
import LineChart from '~/components/Chart/LineChart';
import { useGetPercentageWithAcademicYearQuery } from '~/feature/statistics/statisticsApiSlice';

const Line = () => {
    const { data, isLoading } = useGetPercentageWithAcademicYearQuery();

    const transformedData = data
        ? [
              {
                  id: 'Contributions',
                  data: data.map((item) => ({
                      x: item.academicYear,
                      y: item.percentage,
                  })),
              },
          ]
        : [];
    console.log(data);

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <Box m="20px">
            <Header title="Line Chart" subtitle="This chart shows the percentage of contributions over the years." />
            <Box height="75vh">{data && <LineChart data={transformedData} />}</Box>
        </Box>
    );
};

export default Line;
