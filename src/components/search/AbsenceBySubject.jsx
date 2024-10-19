import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import useDashboardApi from '../../services/dashboardService';
import { Table, Select, Modal, Space, Typography, Input } from 'antd';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getColumnSearchProps } from 'src/utils/searchInColumn';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

function AbsenceBySubject() {
    const [dataChart, setDataChart] = useState({
        labels: [],
        datasets: [],
    });
    const [listStudent, setListStudent] = useState([]);
    const [listSubject, setListSubject] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState({});
    const [percentAbsent, setPercentAbsent] = useState('');
    const [openModal, setOpenModal] = useState(false);

    // const { absenceBySubjectData, studentsAbsenceBySubject, allSubjectInSemester } = useDashboardApi();
    const absenceBySubjectData = async (subjectId) => {
        return {
            data: {
                result: {
                    "10": {
                        total: 5,
                        color: "rgba(255, 99, 132, 0.6)",
                        list_id: [1, 2, 3, 4, 5],
                    },
                    "20": {
                        total: 8,
                        color: "rgba(54, 162, 235, 0.6)",
                        list_id: [6, 7, 8, 9, 10],
                    },
                    "30": {
                        total: 12,
                        color: "rgba(255, 206, 86, 0.6)",
                        list_id: [11, 12, 13, 14, 15],
                    },
                },
            },
        };
    };
    
    const studentsAbsenceBySubject = async (listId) => {
        const studentData = [
            { id: 1, student_code: "SV001", full_name: "Nguyễn Văn A", student_class_id: [1, "Lớp 1"], total_lesson_absent: 2, lecturer_ids: [{ id: 1, display_name: "GV1" }] },
            { id: 2, student_code: "SV002", full_name: "Trần Thị B", student_class_id: [1, "Lớp 1"], total_lesson_absent: 1, lecturer_ids: [{ id: 2, display_name: "GV2" }] },
            // Thêm dữ liệu sinh viên ở đây nếu cần
        ];
        return { data: { result: studentData.filter((student) => listId.includes(student.id)) } };
    };
    
    const allSubjectInSemester = async () => {
        return {
            data: {
                subject_ids: [
                    { id: 1, subject_name: "Toán cao cấp", number_study_credits: 3, number_lesson_allow_absent: 2 },
                    { id: 2, subject_name: "Lý thuyết đồ thị", number_study_credits: 2, number_lesson_allow_absent: 1 },
                    // Thêm dữ liệu môn học khác nếu cần
                ],
            },
        };
    };
    

    useEffect(() => {
        const fetchDataSubject = async () => {
            const results = await allSubjectInSemester();
            setListSubject(results?.data?.subject_ids);
        };

        fetchDataSubject();
    }, []);

    useEffect(() => {
        if (listSubject && listSubject.length > 0) {
            const firstSubject = listSubject[0];

            setSelectedSubject({
                id: firstSubject.id,
                subject_name: firstSubject.subject_name,
                numberStudyCredits: firstSubject.number_study_credits,
                numberLessonAllowAbsent: firstSubject.number_lesson_allow_absent,
            });
        }
    }, [listSubject]);

    useEffect(() => {
        const fetchData = async () => {
            const results = await absenceBySubjectData(selectedSubject?.id);
            let labels = Object.keys(results?.data?.result).map((key) => key);
            const data = labels.map((label) => results?.data.result[label]?.total);
            const backgroundColors = labels.map((label) => results?.data.result[label]?.color);
            const listIdsStudent = Object.values(results.data.result).map((item) => item.list_id);
            labels = labels.map((item) => item + '%');

            const datasets = [
                {
                    label: 'Số SV vắng',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 1,
                    listIdsStudent: listIdsStudent,
                    percentAbsent: labels,
                },
            ];
            setDataChart({
                labels: labels,
                datasets: datasets,
            });
        };

        if (selectedSubject.id > 0) {
            fetchData();
        }
    }, [selectedSubject?.id]);

    const optionsChart = {
        responsive: true,
        plugins: {
            datalabels: {
                // hien thi so lieu tren cot
                display: true,
                color: 'black',
                anchor: 'end',
                align: 'end',
                formatter: (value) => value,
                font: {
                    size: 16,
                },
            },
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {},
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
                ticks: {
                    font: {
                        weight: 'bold',
                    },
                },
            },
        },
        onClick: async function (e, items) {
            if (items.length > 0) {
                const index = items[0]?.index;
                const listId = dataChart.datasets[0].listIdsStudent[index];
                const results = await studentsAbsenceBySubject(listId);

                setListStudent(results?.data?.result);
                setPercentAbsent(dataChart.datasets[0].percentAbsent[index]);
                setOpenModal(true);
            }
        },
    };

    const columns = [
        {
            title: 'Mã sinh viên',
            dataIndex: 'student_code',
            key: 'student_code',
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
            title: 'Lớp',
            key: 'class_name',
            filters: [
                ...listStudent
                    .map((student) => student?.student_class_id[1])
                    .filter((value, index, self) => self.indexOf(value) === index)
                    .map((value) => ({ text: value, value: value })),
            ],
            onFilter: (value, record) => record?.student_class_id[1].indexOf(value) === 0,
            render: (text, record) => record?.student_class_id[1],
            align: 'center',
        },
        {
            title: 'Số tiết vắng',
            dataIndex: 'total_lesson_absent',
            key: 'total_lesson_absent',
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

    return (
        <>
            <div className="flex justify-center">
                <h1 className="text-2xl font-semibold">Sinh viên vắng theo môn học</h1>
            </div>
            <div className="flex justify-center my-2">
                <Select
                    showSearch
                    placeholder="Chọn môn học"
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={
                        listSubject?.map((subject) => ({
                            value: subject?.id,
                            label: subject?.subject_name,
                            numberStudyCredits: subject?.number_study_credits,
                            numberLessonAllowAbsent: subject?.number_lesson_allow_absent,
                        })) ?? []
                    }
                    style={{ width: 300 }}
                    size="large"
                    value={selectedSubject ? selectedSubject.id : undefined}
                    onChange={(value, option) => {
                        setSelectedSubject({
                            id: value,
                            subject_name: option.label,
                            numberStudyCredits: option.numberStudyCredits,
                            numberLessonAllowAbsent: option.numberLessonAllowAbsent,
                        });
                        setListStudent([]);
                    }}
                    allowClear
                />
            </div>
            <div className="w-full h-[500px]">
                <Bar data={dataChart} options={optionsChart} />
            </div>

            <Modal
                title={
                    <div className="flex justify-start items-center space-x-2 text-lg">
                        <div>
                            <span>Danh sách sinh viên vắng môn: </span>{' '}
                            <span className="text-red-600">{selectedSubject?.subject_name}</span>
                        </div>
                        <div>
                            <span>- Vắng: </span> <span className="text-red-600">{percentAbsent}</span>{' '}
                        </div>
                        <div>
                            <span>- STC: </span>{' '}
                            <span className="text-red-600">{selectedSubject?.numberStudyCredits}</span>{' '}
                        </div>
                        <div>
                            <span>- Được phép vắng: </span>{' '}
                            <span className="text-red-600">{selectedSubject?.numberLessonAllowAbsent} </span>
                            (tiết)
                        </div>
                    </div>
                }
                open={openModal}
                footer={null}
                onCancel={() => setOpenModal(false)}
                style={{ top: 20, maxHeight: '600px' }} // Cố định chiều cao của Modal
                width={1200}
                styles={{
                    // khoảng cách giữa header và body
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

export default AbsenceBySubject;
