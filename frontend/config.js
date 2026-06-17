// Configuracao opcional do frontend.
//
// Por padrao, as URLs dos microsservicos sao derivadas do endereco usado para
// abrir o site. Ex.: ao abrir http://SEU_IP:8080, o frontend chama os servicos
// em http://SEU_IP:5001 (cadastro), :5002 (faturamento) e :5003 (agendamento).
//
// Normalmente voce NAO precisa mexer aqui. Ajuste apenas se os servicos estiverem
// em outro host/portas (descomente e edite as linhas abaixo).
window.APP_CONFIG = {
    // serviceHost: "http://SEU_IP_OU_DOMINIO", // aplica as portas :5001/:5002/:5003
    // cadastroUrl: "http://SEU_IP:5001",
    // faturamentoUrl: "http://SEU_IP:5002",
    // agendamentoUrl: "http://SEU_IP:5003"
};
