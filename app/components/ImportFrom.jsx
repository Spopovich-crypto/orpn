"use client";
import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Box, Grid, MenuItem, IconButton
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import dayjs from 'dayjs';

export default function ImportForm() {
  const [targetFolder, setTargetFolder] = useState('');
  const [namePatterns, setNamePatterns] = useState(['']);
  const [encoding, setEncoding] = useState('utf-8');
  const [dbPath, setDbPath] = useState('');
  const [plantCode, setPlantCode] = useState('');
  const [machineCode, setMachineCode] = useState('');
  const [labelDescription, setLabelDescription] = useState('');
  const [events, setEvents] = useState([
    { event: '', description: '', start_time: dayjs(), end_time: dayjs() }
  ]);

  const handleAddEvent = () => {
    setEvents([...events, { event: '', description: '', start_time: dayjs(), end_time: dayjs() }]);
  };

  const handleRemoveEvent = (index) => {
    const newEvents = [...events];
    newEvents.splice(index, 1);
    setEvents(newEvents);
  };

  const handleEventChange = (index, key, value) => {
    const newEvents = [...events];
    newEvents[index][key] = value;
    setEvents(newEvents);
  };

  const handleSubmit = () => {
    const payload = {
      target_folder: targetFolder,
      name_patterns: namePatterns.filter(Boolean),
      encoding,
      db_path: dbPath,
      label: {
        plant_code: plantCode,
        machine_code: machineCode,
        description: labelDescription,
      },
      events: events.map(e => ({
        event: e.event,
        description: e.description,
        start_time: e.start_time.toISOString(),
        end_time: e.end_time.toISOString()
      }))
    };
    console.log('送信データ:', payload);
    // tauri.invoke('import_sensor_data', payload);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom>センサーデータ インポート</Typography>

      <TextField
        label="センサーフォルダパス"
        fullWidth margin="normal"
        value={targetFolder}
        onChange={(e) => setTargetFolder(e.target.value)}
      />

      <TextField
        label="name_patterns（カンマ区切り）"
        fullWidth margin="normal"
        value={namePatterns.join(',')}
        onChange={(e) => setNamePatterns(e.target.value.split(','))}
      />

      <TextField
        label="エンコーディング"
        select fullWidth margin="normal"
        value={encoding}
        onChange={(e) => setEncoding(e.target.value)}
      >
        <MenuItem value="utf-8">utf-8</MenuItem>
        <MenuItem value="shift-jis">shift-jis</MenuItem>
      </TextField>

      <TextField
        label="DB出力パス"
        fullWidth margin="normal"
        value={dbPath}
        onChange={(e) => setDbPath(e.target.value)}
      />

      <Box mt={4}>
        <Typography variant="h6">ラベル情報</Typography>
        <TextField
          label="工場コード"
          fullWidth margin="normal"
          value={plantCode}
          onChange={(e) => setPlantCode(e.target.value)}
        />
        <TextField
          label="機械番号"
          fullWidth margin="normal"
          value={machineCode}
          onChange={(e) => setMachineCode(e.target.value)}
        />
        <TextField
          label="任意説明"
          fullWidth multiline rows={3} margin="normal"
          value={labelDescription}
          onChange={(e) => setLabelDescription(e.target.value)}
        />
      </Box>

      <Box mt={4}>
        <Typography variant="h6">イベント情報</Typography>
        {events.map((e, index) => (
          <Box key={index} border={1} borderRadius={2} borderColor="grey.300" p={2} mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="イベント名"
                  fullWidth
                  value={e.event}
                  onChange={(ev) => handleEventChange(index, 'event', ev.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="イベント説明"
                  fullWidth
                  value={e.description}
                  onChange={(ev) => handleEventChange(index, 'description', ev.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="開始時刻"
                  value={e.start_time}
                  onChange={(val) => handleEventChange(index, 'start_time', val)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="終了時刻"
                  value={e.end_time}
                  onChange={(val) => handleEventChange(index, 'end_time', val)}
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton onClick={() => handleRemoveEvent(index)} color="error">
                  <RemoveCircle /> イベント削除
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button startIcon={<AddCircle />} onClick={handleAddEvent} variant="outlined">
          イベント追加
        </Button>
      </Box>

      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          インポート実行
        </Button>
      </Box>
    </Container>
  );
}
