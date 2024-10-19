import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import useDashboardApi from '../../services/dashboardService';
import { Table, Modal, Space, Typography, Input } from 'antd';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getColumnSearchProps } from 'src/utils/searchInColumn';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

function StudentTuitionByClass() {
    const [dataChart, setDataChart] = useState({
        labels: [],
        datasets: [],
    });
    const [listStudentTuition, setListStudentTuition] = useState([]);
    const [selectClassName, setSelectClassName] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    const { studentTuitionByClassData, listStudentTuitionFee } = useDashboardApi();

    useEffect(() => {
        const fetchData = async () => {
            const results = await studentTuitionByClassData();

            const labels = results?.data?.student_class_tuition_fee?.map((item) => item.student_class_id[1]);
            const numbers = results?.data?.student_class_tuition_fee?.map((item) => item.number_unpaid);
            const colors = results?.data?.list_color;
            const classIds = results?.data?.student_class_tuition_fee?.map((item) => item.id);
            const className = results?.data?.student_class_tuition_fee?.map((item) => item.student_class_id[1]);

            const datasets = [
                {
                    label: 'Số lượng học sinh nợ học phí',
                    data: numbers,
                    backgroundColor: colors,
                    borderWidth: 1,
                    student_class_ids: classIds, // Lưu ID lớp vào dữ liệu biểu đồ
                    student_class_name: className, // Lưu tên lớp học vào dữ liệu biểu đồ
                },
            ];
            setDataChart({
                labels: labels,
                datasets: datasets,
            });
        };

        fetchData();
    }, []);

    const optionsChart = {
        responsive: true,
        plugins: {
            datalabels: {
                // hien thi so lieu tren cot
                display: true,
                color: 'black',
                anchor: 'end',
                align: 'end',
                formatter: (value) => {
                    return value;
                },
                font: {
                    size: 16,
                },
            },
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
        // dieu chinh chieu cao cua bieu do
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 20,
                right: 20,
                top: 30,
                bottom: 20,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Lớp',
                },
                ticks: {
                    font: {
                        weight: 'bold',
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Số lượng',
                },
            },
        },
        onClick: async function (e, items) {
            if (items.length > 0) {
                const index = items[0]?.index;
                const studentClassId = dataChart.datasets[0].student_class_ids[index];
                const results = await listStudentTuitionFee(studentClassId);
                setSelectClassName(dataChart.datasets[0].student_class_name[index]);
                setListStudentTuition(results?.data?.student_tuition_fee_ids);
                setOpenModal(true);
            }
        },
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Mã sinh viên',
            dataIndex: 'student_code',
            key: 'student_id',
            align: 'center',
            ...getColumnSearchProps('Mã Sinh Viên', 'student_code'),
        },
        {
            title: 'Họ và tên',
            dataIndex: 'full_name',
            key: 'student_name',
            align: 'center',
            ...getColumnSearchProps('Họ và tên', 'full_name'),
        },
    ];

    return (
        <>
            <div className="flex justify-center mb-2">
                <h1 className="text-2xl font-semibold">Thống kê đóng học phí theo lớp</h1>
            </div>
            <div className="w-full h-[560px]">
                <Bar data={dataChart} options={optionsChart} />
            </div>

            <Modal
                title={
                    <div className="flex justify-start items-center space-x-2 text-lg">
                        <div>
                            <span> Danh sách sinh viên nợ học phí lớp: </span>{' '}
                            <span className="text-red-600">{selectClassName}</span>
                        </div>
                    </div>
                }
                open={openModal}
                footer={null}
                onCancel={() => setOpenModal(false)}
                style={{ top: 30, maxHeight: '600px' }} // Cố định chiều cao của Modal
                width={800}
                styles={{
                    body: {
                        maxHeight: '500px', // Giới hạn chiều cao của phần thân modal
                        // overflowY: 'auto', // Thêm thanh cuộn dọc khi nội dung vượt quá chiều cao
                    },
                }}
            >
                <div>
                    <Table
                        columns={columns}
                        dataSource={listStudentTuition}
                        pagination={false}
                        rowKey={(record) => record.id}
                        scroll={{ y: 400 }} // Cố định chiều cao bảng và thêm thanh cuộn
                        footer={(currentDataSource) => (
                            <Space className="flex justify-end text-base font-medium">
                                <Typography className="font-bold">Tổng số: </Typography>
                                <Input
                                    disabled
                                    className="disabled:bg-white disabled:text-red-500 font-bold w-16"
                                    value={currentDataSource?.length}
                                />
                            </Space>
                        )}
                    />
                </div>
            </Modal>
        </>
    );
}

export default StudentTuitionByClass;
