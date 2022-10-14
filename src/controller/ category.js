const knex = require("../../connection");

const registerCategory = async (req, res) => {
    const { descricao } = req.body;
    if (!descricao) {
        return res.status(400).json({ message: "Preencha a descrição da categoria" });
    }
    try {
        const checkDescription = await knex('categorias').where({ descricao }).first();
        if (checkDescription) {
            return res.status(400).json({ message: "Já existe essa descrição" });
        }
        const description = await knex('categorias').insert({ descricao }).returning('*');

        return res.status(201).json(description[0]);

    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const listCategory = async (req, res) => {
    try {
        const list = await knex('categorias');
        res.json(list);

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const updateCategory = async (req, res) => {
    const { id, descricao } = req.body;

    if (!descricao) {
        return res.status(400).json({ message: "Preencha a descrição" });
    }
    const checkDescription = await knex('categorias').where({ descricao }).first();
    if (checkDescription) {
        return res.status(400).json({ message: "Já existe uma categoria com o nome informado." });
    }
    try {
        const updatedCategory = await knex('categorias').where({ id }).update({
            descricao
        }).returning('*');
        if (!updatedCategory[0]) {
            return res.status(400).json({ message: "Descrição não foi atualizado" })
        }
        return res.status(200).json({ message: "Descrição foi atualizado com sucesso!!" });

    } catch (error) {
        return res.status(500).json(error.message);
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await knex('categorias').where({ id }).first();

        if (!category) {
            return res.status(404).json({ message: 'Categoria não encontrada' });
        }
        const deleteCategory = await knex('categorias').where({ id }).del()

        if (!deleteCategory) {
            return res.status(400).json({ message: "Categoria não foi excluida" });
        }

        return res.status(200).json({ message: 'Categoria excluido com sucesso' });
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listCategory, updateCategory, registerCategory, deleteCategory
}