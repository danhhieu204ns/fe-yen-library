import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Input, Typography, Col, Row, Card, Button, Alert, Select, Checkbox } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import useManageInfoApi from 'src/services/manageInfoService';
import { toast } from 'react-toastify';
import SubjectInSemester from './SubjectInSemester';

function EditSemester() {
    const [listSchoolYear, setListSchoolYear] = useState([]);
    const [yearStart, setYearStart] = useState('');
    const [formData, setFormData] = useState({
        schoolYearId: '',
        semesterNumber: 1,
        currentSemester: false,
    });
    const [loadingSync, setLoadingSync] = useState(false);
    const { id } = useParams();
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { oneSemester, editSemester, allSchoolYear, syncStudent } = useManageInfoApi();

    useEffect(() => {
        const fetchData = async () => {
            const result = await oneSemester(id);
            setFormData({
                schoolYearId: result?.semester[0]?.school_year_id[0],
                semesterNumber: result?.semester[0]?.semester_number,
                currentSemester: result?.semester[0]?.current_semester,
            });
            setYearStart(result?.semester[0]?.school_year_id[1].slice(0, 4));
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchDataSchoolYear = async () => {
            const results = await allSchoolYear();
            setListSchoolYear(results?.school_year_ids);
        };

        fetchDataSchoolYear();
    }, []);

    const handleEditSemester = async () => {
        const result = await editSemester(id, formData);

        if (result?.status === 409) {
            setError('Kỳ học đã tồn tại');
            return;
        } else {
            toast.success('Cập nhật kỳ học thành công');
            navigate('/manage/semester');
        }
    };

    const handleSyncStudent = async () => {
        setLoadingSync(true);
        const result = await syncStudent(id);
        setLoadingSync(false);

        if (result?.message) {
            toast.success(result?.message);
        }
    };

    return (
        <Card
            title={
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl">Kỳ học</h1>

                    <div className="flex space-x-2">
                        <Button type="primary" size="large" onClick={handleEditSemester}>
                            Lưu
                        </Button>
                        <Link to={'/manage/semester'}>
                            <Button size="large">Hủy</Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <div className="mx-6">
                <div className="flex justify-end">
                    <Button type="primary" onClick={handleSyncStudent} loading={loadingSync} icon={<SyncOutlined />}>
                        Đồng bộ SV đóng HP
                    </Button>
                </div>
                <Row>
                    <Col span={24}>{error && <Alert message="Lỗi" description={error} type="error" showIcon />}</Col>
                </Row>
                <Row gutter={[80, 16]} className="my-4">
                    <Col xs={24} sm={12} lg={12} className="flex flex-col">
                        <Typography.Text className="text-base">Năm học</Typography.Text>
                        <Select
                            size="large"
                            placeholder="Chọn năm học"
                            options={listSchoolYear?.map((item) => ({
                                label: item.display_name,
                                value: item.id,
                                startYear: item.start_year,
                            }))}
                            value={formData?.schoolYearId}
                            onChange={(value, options) => {
                                setFormData({ ...formData, schoolYearId: value });
                                setYearStart(options.startYear);
                            }}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            showSearch
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                        <Typography.Text className="text-base"> Số thự tự kỳ</Typography.Text>
                        <Input
                            size="large"
                            placeholder="Nhập số thứ tự kỳ"
                            type="number"
                            defaultValue={formData.semesterNumber}
                            value={formData?.semesterNumber}
                            onChange={(e) => setFormData({ ...formData, semesterNumber: e.target.value })}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={12}>
                        <Typography.Text className="text-base">Kỳ học</Typography.Text>
                        <Input
                            size="large"
                            placeholder="Kỳ học"
                            disabled
                            value={
                                yearStart && formData?.semesterNumber
                                    ? `${yearStart} - ${formData?.semesterNumber}`
                                    : ''
                            }
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={12} className="flex flex-col">
                        <Typography.Text className="text-base">Kỳ hiện tại</Typography.Text>
                        <Checkbox
                            className="mt-2"
                            checked={formData?.currentSemester}
                            onChange={(e) => setFormData({ ...formData, currentSemester: e.target.checked })}
                        />
                    </Col>
                </Row>
            </div>

            <SubjectInSemester semesterId={id} />
        </Card>
    );
}

export default EditSemester;
