package com.logistica;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AlocacaoServiceTest {
    @Test
    void deveSalvarAlocacao() {
        AlocacaoService service = new AlocacaoService();
        Alocacao a = new Alocacao();
        a.setCodigo("TESTE-001");
        Alocacao result = service.salvar(a);
        assertNotNull(result.getId());
    }
}
