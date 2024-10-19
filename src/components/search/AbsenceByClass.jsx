import { useState, useEffect } from 'react';
import { DatePicker, Table, Modal, Space, Typography, Input } from 'antd';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import { getColumnSearchProps } from 'src/utils/searchInColumn';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);
import useDashboardApi from 'src/services/dashboardService';

function AbsenceByClass() {
    const [dataChart, setDataChart] = useState({
        labels: [],
        datasets: [],
    });
    const [date, setDate] = useState({
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const [listStudent, setListStudent] = useState([]);
    const [selectedClassName, setSelectedClassName] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const { absenceByClassData, listStudentAbsence } = useDashboardApi();

    useEffect(() => {
        const fetchData = async () => {
            const results = await absenceByClassData(date);
            const lables = results?.data?.student_class_absent.map((item) => item.class_name);
            const data = results?.data?.student_class_absent.map((item) => item.number_absent);
            const colors = results?.data?.list_color;
            const student_absent_id = results?.data?.student_class_absent.map((item) => item.id);

            const datasets = [
                {
                    label: 'Số lượng vắng',
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 1,
                    student_absent_id: student_absent_id,
                    student_class_name: lables,
                },
            ];

            setDataChart({
                labels: lables,
                datasets: datasets,
            });
        };

        if (date) fetchData();
    }, [date]);

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
                const classId = dataChart.datasets[0].student_absent_id[index];
                const results = await listStudentAbsence(classId);
                setSelectedClassName(dataChart.datasets[0].student_class_name[index]);
                setListStudent(results?.data?.student_absent_ids);
                setOpenModal(true);
            }
        },
    };

    const columns = [
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
        {
            title: 'Số tiết vắng',
            key: 'number_absent',
            dataIndex: 'number_lesson_absent',
            align: 'center',
        },
        {
            title: 'Lý do',
            key: 'reason',
            dataIndex: 'reason',
            align: 'center',
        },
        {
            title: 'Giảng viên',
            key: 'lecturer',
            align: 'center',
            render: (text, record) => (
                <div className="flex flex-col">
                    {record?.lecturer_ids.map((item) => (
                        <div className="border p-1 rounded-lg m-1 whitespace-nowrap" key={item.id}>
                            {item.display_name}
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    const onChange = (date, dateString) => {
        setDate({
            day: date?.$D,
            month: date?.$M + 1,
            year: date?.$y,
        });
        setListStudent([]);
    };

    return (
        <>
            <div className="flex justify-center mb-3">
                <h1 className="text-2xl font-semibold">Sinh viên vắng theo lớp</h1>
            </div>
            <div className="flex justify-center mb-2">
                <DatePicker
                    format={'DD/MM/YYYY'}
                    placeholder="Chọn ngày"
                    onChange={onChange}
                    allowClear={false}
                    defaultValue={dayjs()}
                    size="large"
                />
            </div>
            <div className="w-full h-[500px]">
                <Bar data={dataChart} options={optionsChart} />
            </div>

            <Modal
                title={
                    <div className="flex justify-start items-center space-x-2 text-lg">
                        <div>
                            <span>Danh sách sinh viên vắng lớp: </span>{' '}
                            <span className="text-red-600">{selectedClassName}</span>
                        </div>
                        <div>
                            <span>- Ngày: </span>{' '}
                            <span className="text-red-600">
                                {dayjs(listStudent[0]?.date_absent).format('DD/MM/YYYY')}
                            </span>
                        </div>
                    </div>
                }
                open={openModal}
                footer={null}
                onCancel={() => setOpenModal(false)}
                style={{ top: 20, maxHeight: '600px' }} // Cố định chiều cao của Modal
                width={1200}
                styles={{
                    header: {
                        marginBottom: '20px',
                    },
                    body: {
                        maxHeight: '500px', // Giới hạn chiều cao của phần thân modal
                        // overflowY: 'auto', // Thêm thanh cuộn dọc khi nội dung vượt quá chiều cao
                    },
                }}
            >
                <div>
                    <Table
                        columns={columns}
                        dataSource={listStudent}
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

export default AbsenceByClass;
