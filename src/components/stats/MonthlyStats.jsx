import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useStatsApi } from "src/services/statsService";

const MonthlyStats = () => {
    const [data, setData] = useState([]);

    const { getMonthlyBorrowingStats } = useStatsApi();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getMonthlyBorrowingStats();
            setData(res.data);
        }
        fetchData();
    }, []);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default MonthlyStats;
