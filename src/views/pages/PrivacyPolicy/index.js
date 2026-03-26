// PrivacyPolicy.jsx
import React from 'react';
import {
    Container,
    Heading1,
    Heading2,
    Paragraph,
    List,
    ListItem,
    LastUpdated,
    ContactInfo,
    Link
} from './styles';

const PrivacyPolicy = () => {
    return (
        <Container>
            <Heading1>Política de Privacidade</Heading1>
            <Heading2>Introdução</Heading2>
            <Paragraph>Esta Política de Privacidade ("Política") descreve como a JOPE ISB S.A ("Empresa", "nós", "nosso") coleta, usa e compartilha suas informações pessoais quando você visita ou usa nosso site, <Link href="https://www.jopeisbsystem.com.br/">https://www.jopeisbsystem.com.br/</Link> ("Site"). Ao acessar ou usar o Site, você concorda com os termos desta Política.</Paragraph>

            <Heading2>Coleta de Informações</Heading2>
            <Heading2 as="h3">Informações Coletadas:</Heading2>
            <List>
                <ListItem><strong>Nome:</strong> Utilizado para identificação do usuário.</ListItem>
                <ListItem><strong>Email:</strong> Utilizado para contato e autenticação.</ListItem>
                <ListItem><strong>Telefone:</strong> Utilizado para contato em relação às ordens de serviço.</ListItem>
            </List>

            <Heading2 as="h3">Autenticação:</Heading2>
            <List>
                <ListItem>Para acessar o sistema, é necessário fornecer seu email e senha.</ListItem>
                <ListItem>Após o login, um token é gerado e armazenado no localStorage do navegador para validação da sessão com JWT.</ListItem>
                <ListItem>O ID da unidade escolhida é armazenado no localStorage para manter a informação selecionada em caso de recarregamento da página.</ListItem>
            </List>

            <Heading2 as="h3">Cadastro de Usuário:</Heading2>
            <List>
                <ListItem>O cadastro de novos usuários é realizado exclusivamente por administradores do sistema.</ListItem>
                <ListItem>Informações necessárias para o cadastro: Nome, Email, Perfil e Senha.</ListItem>
            </List>

            <Heading2>Uso das Informações</Heading2>
            <Paragraph>As informações coletadas são usadas para os seguintes propósitos:</Paragraph>
            <List>
                <ListItem><strong>Autenticação e Autorização:</strong> Verificar a identidade do usuário e permitir acesso ao sistema.</ListItem>
                <ListItem><strong>Gerenciamento de Ordens de Serviço:</strong> Facilitar a abertura, acompanhamento e encerramento de ordens de serviço.</ListItem>
                <ListItem><strong>Comunicação:</strong> Entrar em contato com o usuário sobre atualizações e notificações relacionadas às ordens de serviço.</ListItem>
                <ListItem><strong>Logs de Rastreamento:</strong> Registrar data e hora de cadastro, exclusão ou modificação de itens para fins de auditoria e segurança.</ListItem>
            </List>

            <Heading2>Armazenamento e Proteção das Informações</Heading2>
            <Paragraph>Nós utilizamos somente cookies primários. Estes cookies são definidos e gerenciados pela empresa e não por terceiros. Eles são armazenados na sua máquina quando você realiza o acesso utilizando o login e senha cadastrado. Nenhuma destas informações são compartilhadas com terceiros.</Paragraph>
            <List>
                <ListItem><strong>LocalStorage:</strong> Armazenamos o token de sessão e o ID da unidade escolhida no localStorage do navegador para facilitar a validação da sessão e manter preferências do usuário.</ListItem>
                <ListItem><strong>Segurança:</strong> Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado, uso ou divulgação.</ListItem>
            </List>

            <Heading2>Evidências nas Ordens de Serviço</Heading2>
            <Paragraph>Ao abrir uma solicitação de ordem de serviço, é necessário adicionar uma evidência. Esta evidência pode ser:</Paragraph>
            <List>
                <ListItem>Um arquivo da memória interna do dispositivo.</ListItem>
                <ListItem>Uma foto tirada na hora.</ListItem>
            </List>

            <Heading2>Direitos dos Usuários</Heading2>
            <Paragraph>Você tem o direito de:</Paragraph>
            <List>
                <ListItem><strong>Acessar suas informações pessoais:</strong> Solicitar uma cópia das informações que temos sobre você.</ListItem>
                <ListItem><strong>Retificar suas informações pessoais:</strong> Solicitar a correção de informações incorretas ou incompletas.</ListItem>
            </List>

            <Heading2>Privacidade Infantil</Heading2>
            <Paragraph>Este site pode coletar informações de menores de idade no caso de menores aprendizes que trabalham na empresa e utilizem o sistema. Somente neste caso os dados serão tratados para o cadastro e disponibilização de acesso. Os dados pessoais destes menores tiveram a coleta e tratamento autorizados por seu responsável legal conforme contrato do programa menor aprendiz.</Paragraph>

            <Heading2>Alterações nesta Política</Heading2>
            <Paragraph>Podemos atualizar esta Política periodicamente. Notificaremos você sobre qualquer alteração significativa por meio de um aviso no Site ou por e-mail.</Paragraph>

            <Heading2>Contato</Heading2>
            <Paragraph>Se você tiver alguma dúvida ou preocupação sobre esta Política, entre em contato com nosso Encarregado de Proteção de Dados em:</Paragraph>
            <ContactInfo>
                <Paragraph><strong>Email:</strong> <Link href="mailto:compliance.dpo@spesaudebh.com.br">compliance.dpo@spesaudebh.com.br</Link></Paragraph>
            </ContactInfo>

            <Heading2>Observações Adicionais</Heading2>
            <Paragraph>Esta Política é regida e interpretada de acordo com as leis do Brasil. Ao acessar ou usar o Site, você concorda em se submeter à jurisdição exclusiva dos tribunais do Brasil para qualquer disputa relacionada a esta Política.</Paragraph>

            <LastUpdated><strong>Última atualização:</strong> 12/06/2024</LastUpdated>
        </Container>
    );
};

export default PrivacyPolicy;
