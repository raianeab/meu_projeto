-- =========================
-- TABELA DE MAPEAMENTO DE COLUNAS
-- =========================

CREATE TABLE IF NOT EXISTS dados_headers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    technical_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- TABELA PRINCIPAL DE DADOS
-- =========================

CREATE TABLE IF NOT EXISTS dados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    
    "Business_Unit" TEXT,
    "SP/Manaus" TEXT,
    "Group_Macro" TEXT,
    "Group_Mid" TEXT,
    "Group_Micro" TEXT,
    "EmployeeID" TEXT NOT NULL,
    "EmployeeJobTitle" TEXT,
    "InternalGrade" TEXT,
    "EmployeeGroup" TEXT,
    "Estado" TEXT,
    "Cidade" TEXT,
    "Gender" TEXT,
    "HireDate" DATE,
    "BirthDate" DATE,
    "ManagerEmployeeID" TEXT,
    "Monthly_Salary" DECIMAL(15,2),
    "Monthly_FixedAdditives" DECIMAL(15,2),
    "SalariesPerYear" DECIMAL(15,2),
    "ICP_Target" DECIMAL(15,2),
    "ICP_Paid" DECIMAL(15,2),
    "ILP_Target" DECIMAL(15,2),
    "ILP_Paid" DECIMAL(15,2),
    "SB" DECIMAL(15,2),
    "RDA" DECIMAL(15,2),
    "Layer" TEXT,
    "Span" INTEGER,
    "ManagerJobTitle" TEXT,
    "ManagerGroup" TEXT,
    "ManagerLayer" TEXT,
    "IEG" DECIMAL(10,4),
    "AUX_IEG1" DECIMAL(10,4),
    "AUX_IEG2" DECIMAL(10,4),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- CONSTRAINT ÚNICA
-- =========================

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'dados_company_matricula_unique'
    ) THEN
        ALTER TABLE dados 
        ADD CONSTRAINT dados_company_matricula_unique 
        UNIQUE (company_id, "EmployeeID");
    END IF;
END $$;

-- =========================
-- ÍNDICES
-- =========================

CREATE INDEX IF NOT EXISTS idx_dados_company_id ON dados(company_id);
CREATE INDEX IF NOT EXISTS idx_dados_employee_id ON dados("EmployeeID");
CREATE INDEX IF NOT EXISTS idx_dados_manager_employee_id ON dados("ManagerEmployeeID");

-- =========================
-- TRIGGER updated_at
-- =========================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_dados_updated_at ON dados;

CREATE TRIGGER update_dados_updated_at 
BEFORE UPDATE ON dados 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();
