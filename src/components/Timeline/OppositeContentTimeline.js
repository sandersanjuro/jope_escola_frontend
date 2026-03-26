import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { getBrlFormatDate } from 'utils/date';

export default function OppositeContentTimeline({ timeline = [], fim_atendimento, inicio_atendimento }) {
    let itens = timeline || [];
    
    return (
        <React.Fragment>
            <Timeline position="alternate">
                {itens.map((desc, index) => {
                    const isPdf = desc.url && desc.url.split('?')[0].toLowerCase().endsWith('.pdf');  // Verifica o .pdf sem considerar parâmetros
                    return (
                        <TimelineItem key={index}>
                            <TimelineOppositeContent color="text.secondary">{desc.status_id === 2 ? getBrlFormatDate(inicio_atendimento) : desc.status_id === 5 ? getBrlFormatDate(fim_atendimento) : desc.created_at}</TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color={desc.color} />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <p>
                                    <strong>{desc.description}</strong>
                                </p>
                                {desc.url && (
                                    <a href={desc.url} target="_blank" rel="noopener noreferrer">
                                        {isPdf ? (
                                            <PictureAsPdfIcon
                                                style={{ fontSize: 40, color: 'red' }}
                                            />
                                        ) : (
                                            <img
                                                style={{ width: '80px', height: '80px' }}
                                                src={desc.url}
                                                alt="evidencia"
                                            />
                                        )}
                                    </a>
                                )}
                                {desc.descricao_atendimento && desc.descricao_atendimento !== 'null' && <p>{desc.descricao_atendimento}</p>}
                            </TimelineContent>
                        </TimelineItem>
                    );
                })}
            </Timeline>
        </React.Fragment>
    );
}
