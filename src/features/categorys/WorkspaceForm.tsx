import React, { ChangeEvent, useState, useEffect } from 'react';
import styles from '../../shared/styles/forms.module.sass'; 
import { I_workspace_types } from '../../shared/types';
import { create_workspace_fn, update_workspace_fn } from './model/category.model';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../App/store/store';
import { get_all_workspaces, update_workspase } from '../../App/store/global_category_slise';

interface WorkspaceFormProps {
    initialData?: I_workspace_types; // Если есть — редактируем, если нет — создаем
    onSuccess?: () => void;         // Коллбек для обновления списка или редиректа
}

export default function WorkspaceForm({ initialData, onSuccess }: WorkspaceFormProps) {
    const isEditMode = !!initialData;
    const dispatch = useDispatch<AppDispatch>()
    const [formState, setFormState] = useState<{ name: string; color: string }>({
        name: '',
        color: '#3498db', // Дефолтный приятный цвет, если пользователь не выбрал
    });

    // Заполняем форму данными, если мы в режиме редактирования
    useEffect(() => {
        if (initialData) {
            setFormState({
                name: initialData.name,
                color: initialData.color || '#3498db',
            });
        }
    }, [initialData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!formState.name.trim()) {
            alert('Имя окружения не может быть пустым');
            return;
        }

        try {
            if (isEditMode && initialData?.workspace_id !== undefined) {
                const data:I_workspace_types={
           workspace_id:initialData.workspace_id,
           name:formState.name,
           color:formState.color
                }
                dispatch(update_workspase(data))
                await update_workspace_fn(initialData.workspace_id, formState.name, formState.color);
                console.log('Workspace updated successfully');
            } else {
                // Создание
                await create_workspace_fn(formState.name, formState.color);
                console.log('Workspace created successfully');
                // Сбрасываем форму, если это создание
           dispatch(get_all_workspaces())
                setFormState({ name: '', color: '#3498db' });
            }

            if (onSuccess) onSuccess();
        } catch (err) {
            alert('Ошибка при сохранении окружения');
        }
    };

    return (
        <div className={styles.main_conteiner}>
            <form className={styles.category_form} onSubmit={handleSubmit}>
                <h2>{isEditMode ? 'Изменить окружение' : 'Создать окружение'}</h2>

                {/* Поле ввода имени */}
                <div className={styles.category_form__item}>
                    <label className={styles.category_form__item_lebel} htmlFor="workspace_name">
                        Название окружения:
                    </label>
                    <input
                        name="name"
                        id="workspace_name"
                        type="text"
                        placeholder="Например: Работа, Личное, Учеба"
                        onChange={handleChange}
                        value={formState.name}
                    />
                </div>

                {/* Поле выбора цвета окружения */}
                <div className={styles.category_form__item}>
                    <label className={styles.category_form__item_lebel} htmlFor="workspace_color">
                        Цвет окружения (визуальная метка):
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                        <input
                            name="color"
                            id="workspace_color"
                            type="color"
                            onChange={handleChange}
                            value={formState.color}
                            style={{ cursor: 'pointer', width: '40px', height: '40px', border: 'none', borderRadius: '4px' }}
                        />
                        <span>{formState.color}</span>
                    </div>
                </div>

                <button type="submit" style={{ marginTop: '20px' }}>
                    {isEditMode ? 'Сохранить изменения' : 'Создать окружение'}
                </button>
            </form>
        </div>
    );
}