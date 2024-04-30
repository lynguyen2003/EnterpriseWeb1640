import { ResponsivePie } from '@nivo/pie';

const CenteredMetric = ({ dataWithArc, centerX, centerY, metricName, isDashboard = false }) => {
    let total = 0;
    dataWithArc.forEach((datum) => {
        total += datum.data.value;
    });

    return (
        <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            dominantBaseline="central"
            style={isDashboard ? { fontSize: '20px', fontWeight: '600' } : { fontSize: '36px', fontWeight: '600' }}
        >
            {total}
            <tspan
                x={centerX}
                y={centerY + 10}
                style={
                    isDashboard
                        ? { fontSize: '12px', fontWeight: '400', marginTop: '2px' }
                        : { fontSize: '16px', fontWeight: '400', marginTop: '5px' }
                }
            >
                {metricName}
            </tspan>
        </text>
    );
};

const PieChart = ({ data, isDashboard = false, metricName }) => {
    return (
        <ResponsivePie
            data={data}
            margin={
                isDashboard
                    ? { top: 20, right: 80, bottom: 80, left: 80 }
                    : { top: 40, right: 120, bottom: 80, left: 80 }
            }
            activeOuterRadiusOffset={8}
            colors={{ scheme: 'paired' }}
            borderWidth={1}
            borderColor={{
                from: 'color',
                modifiers: [['darker', 0.2]],
            }}
            innerRadius={0.45}
            fit={false}
            enableArcLinkLabels={false}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabel="value"
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [['brighter', '3']],
            }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true,
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                },
            ]}
            fill={[
                {
                    match: {
                        id: 'ruby',
                    },
                    id: 'dots',
                },
                {
                    match: {
                        id: 'c',
                    },
                    id: 'dots',
                },
                {
                    match: {
                        id: 'go',
                    },
                    id: 'dots',
                },
                {
                    match: {
                        id: 'python',
                    },
                    id: 'dots',
                },
                {
                    match: {
                        id: 'scala',
                    },
                    id: 'lines',
                },
                {
                    match: {
                        id: 'lisp',
                    },
                    id: 'lines',
                },
                {
                    match: {
                        id: 'elixir',
                    },
                    id: 'lines',
                },
                {
                    match: {
                        id: 'javascript',
                    },
                    id: 'lines',
                },
            ]}
            legends={
                isDashboard
                    ? []
                    : [
                          {
                              anchor: 'top-left',
                              direction: 'column',
                              justify: false,
                              translateX: -53,
                              translateY: -24,
                              itemsSpacing: 0,
                              itemWidth: 93,
                              itemHeight: 26,
                              itemTextColor: '#999',
                              itemDirection: 'left-to-right',
                              itemOpacity: 1,
                              symbolSize: 14,
                              symbolShape: 'square',
                              effects: [
                                  {
                                      on: 'hover',
                                      style: {
                                          itemTextColor: '#000',
                                      },
                                  },
                              ],
                          },
                      ]
            }
            layers={[
                'arcs',
                'arcLabels',
                'arcLinkLabels',
                'legends',
                (props) => <CenteredMetric {...props} metricName={metricName} isDashboard={isDashboard} />,
            ]}
        />
    );
};

export default PieChart;
