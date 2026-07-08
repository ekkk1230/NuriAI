import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ContentBox } from "./ContentBox";

const data = [
    { name: '신체운동', count: 3 },
    { name: '의사소통', count: 1 },
    { name: '사회관계', count: 0 },
    { name: '예술경험', count: 2 },
    { name: '자연탐구', count: 4 },
];

const COLORS = [ '#e9ecef', '#d0ebff', '#e2f9b8', '#ffdeeb', '#d3f9d8',];

export default function CategoryBarChart() {
    return (
        <ContentBox title="영역별 계획안" subTitle="내가 생성한 영역별 계획안">
            <ResponsiveContainer width="100%" height="80%">
                <BarChart
                    layout="vertical" // 가로형 차트를 위한 설정
                    data={data}
                    margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 13, fontWeight: 600, fill: '#374151' }}
                    />
                    <Tooltip
                        cursor={{ fill: '#f9fafb' }} 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-2xl">
                                        <p className="text-[1.4rem] font-extrabold text-gray-800 mb-2 pb-1">
                                            {label}
                                        </p>
                                        
                                        <p className="text-[1.2rem] text-gray-600 font-semibold">
                                            생성된 계획안: <span className="text-indigo-600">{payload[0].value}개</span>
                                        </p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={32}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </ContentBox>
    )
}
